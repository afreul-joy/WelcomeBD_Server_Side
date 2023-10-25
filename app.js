require("dotenv").config();
require("./config/database");

const express = require("express");
const app = express();
const userCollection = require("./models/userCollection");
const tourismSpotCollection = require("./models/tourismSpotCollection");
const PaymentCollection = require("./models/paymentCollection"); // Updated model name
const guideCollection = require("./models/guideCollection");
const port = 9000;

const bodyParser = require("body-parser");
const cors = require("cors");
const { ObjectId } = require("mongodb");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

//----------------------- GET Showing all place & guide data --------------------
app.get("/explore", async (req, res) => {
  try {
    const products = await tourismSpotCollection.find({}).exec();
    // console.log(products)
    res.json(products);
  } catch (error) {
    // Handle any potential errors here
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
});
app.get("/guide", async (req, res) => {
  try {
    const products = await guideCollection.find({}).exec();
    // console.log(products);
    res.json(products);
  } catch (error) {
    // Handle any potential errors here
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
});
//----------GET API FILTERING BY EMAIL -----------------
app.get("/userOrders", async (req, res) => {
  const email = req.query.email;
  const query = { email: email };
  // console.log(query);
  const cursor = PaymentCollection.find(query);
  const product = await cursor; // This is correct
  res.json(product);
});

//----------GET ADMIN EMAIL-----------------
app.get("/api/users/admin/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const user = await userCollection.findOne({ email });
    if (user && user.role === "admin") {
      res.json({ isAdmin: true });
    } else {
      res.json({ isAdmin: false });
    }
  } catch (error) {
    console.error("Error checking admin status", error);
    res
      .status(500)
      .json({ error: "An error occurred while checking admin status" });
  }
});
//-----------------STRIPE PAYMENT ----------------
const stripe = require("stripe")(
  "sk_test_51LclMjBLMFfgNXFxKTR7J0t8YucyD3nGk4adO8QwwiSDdIPfEdoLRtcsEU6lUU3h4oY0PQfg1FsnuckTB9itaHCt00UdYDm3bU"
);

app.post("/payment", cors(), async (req, res) => {
  try {
    const { amount, id, guide, email, journeyDate, location, img } = req.body;
    // console.log(req.body);

    // Create a new Payment instance
    const payment = new PaymentCollection({
      // Updated model name
      amount,
      id,
      guide,
      email,
      journeyDate,
      location,
      img,
    });

    // Save payment data to the database
    await payment.save();

    // Perform the Stripe payment processing
    const stripePayment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "WelcomeBD company",
      payment_method: id,
      confirm: true,
      return_url: "https://yourwebsite.com/success",
    });

    // Update the payment status in the database based on the Stripe payment result
    if (stripePayment.status === "succeeded") {
      payment.paymentStatus = "Success";
    } else {
      payment.paymentStatus = "Failed";
    }

    await payment.save();

    res.json({
      message: "Payment processed successfully",
      success: stripePayment.status === "succeeded",
    });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({
      message: "Payment processing failed",
      success: false,
      error: error.message,
    });
  }
});

//----------POST API ADD PACKAGES -----------------
app.post("/api/addPackages", async (req, res) => {
  console.log(req.body);
  const newPackageData = req.body;
  console.log("POST VAI", newPackageData);

  // Create a new instance of the tourismSpotCollection model with the package data
  const newPackage = new tourismSpotCollection(newPackageData);

  // Save the new package data to the database
  try {
    const savedPackage = await newPackage.save();
    res.json(savedPackage);
  } catch (error) {
    console.error("Error adding a new package:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the package" });
  }
});

//----------- POST: /api/register -> Create new user ------------
app.post("/api/users", async (req, res) => {
  // console.log(req.body);
  try {
    const email = req.body.email;

    // Check if the user with this email already exists
    const existingUser = await userCollection.findOne({ email });

    if (existingUser) {
      // If the user already exists, update any necessary information, but don't change the role
      existingUser.name = req.body.displayName;
      const updatedUser = await existingUser.save();
      res.status(200).send({
        success: true,
        message: "User data updated",
        data: updatedUser,
      });
    } else {
      // If the user does not exist, create a new user with the "user" role
      const newUser = new userCollection({
        name: req.body.displayName,
        email: req.body.email,
        role: "user", // Set the role to "user"
      });

      const user = await newUser.save();

      if (user) {
        res.status(200).send({
          success: true,
          message: "New user registered",
          data: user,
        });
      } else {
        res.status(400).send({
          success: false,
          message: "User not found",
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

//----------PUT API UPSERT FOR GOOGLE SING-IN USER -----------------
app.put("/api/users", async (req, res) => {
  const user = req.body;
  // console.log(req.body);

  // Do not change the 'role' property for Google login users, and also check if the user is not already an admin
  const filter = { email: user.email, name: user.displayName };
  const existingUser = await userCollection.findOne(filter);

  if (!existingUser) {
    // If the user doesn't exist, create a new user with the "user" role
    user.role = "user";
    const newUser = new userCollection(user);
    const result = await newUser.save();
    res.json(result);
  } else if (existingUser.role === "admin") {
    // If the user exists and is already an admin, update their information, but keep the role as "admin"
    const updateDoc = { $set: user };
    const result = await userCollection.updateOne(filter, updateDoc);
    res.json(result);
  } else {
    // If the user exists and is not an admin, update their information and change the role to "user"
    const updateDoc = { $set: user, $set: { role: "user" } };
    const result = await userCollection.updateOne(filter, updateDoc);
    res.json(result);
  }
});

//----------PUT API UPSERT MAKE ADMIN -----------------
app.put("/api/users/admin/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const user = await userCollection.findOne({ email });

    if (user) {
      user.role = "admin";
      const updatedUser = await user.save();
      res.json({
        success: true,
        message: "User role updated to admin",
        data: updatedUser,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user role to admin", error);
    res.status(500).json({
      error: "An error occurred while updating user role to admin",
    });
  }
});
// ================PUT API for updating a package============
app.put("/explore/:id", async (req, res) => {
  // console.log(req.params,req.body);
  const id = req.params.id;
  const updatedPackageData = req.body;
  try {
    const query = { _id: new ObjectId(id) };
    // console.log(query);
    const updatedPackage = await tourismSpotCollection.findOneAndUpdate(
      query,
      updatedPackageData,
      { new: true }
    );
    // console.log(updatedPackage)
    if (updatedPackage) {
      res.json(updatedPackage);
    } else {
      res.status(404).json({ error: "Package not found" });
    }
  } catch (error) {
    console.error("Error updating package", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the package" });
  }
});

// --------------------DELETE API for deleting a package-----------
app.delete("/explore/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const query = { _id: new ObjectId(id) };
    const result = await tourismSpotCollection.deleteOne(query);
    if (result.deletedCount === 1) {
      res.json({
        message: "Package deleted successfully",
        deletedPackageId: id,
      });
    } else {
      res.status(404).json({ error: "Package not found" });
    }
  } catch (error) {
    console.error("Error deleting package", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the package" });
  }
});

//----------DELETE API FOR CANCEL ORDER -----------------
app.delete("/userOrders/:_id", async (req, res) => {
  const id = req.params._id;
  try {
    const query = { _id: new ObjectId(id) };
    const result = await PaymentCollection.deleteOne(query);
    if (result.deletedCount === 1) {
      res.json({ message: "Order deleted successfully", deletedOrderId: id });
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    console.error("Error deleting order", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the order" });
  }
});

//-------------ROOT PAGE ------------
app.get("/", (req, res) => {
  res.send("Server Ok!");
});

//-------------handle bad url request------------
app.use((req, res) => {
  res.send("<h1>Bad Request - 404 - PAGE NOT FOUND </h1>");
});

//-------------Server Listen------------
app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
});
