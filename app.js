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
    console.log(products);
    res.json(products);
  } catch (error) {
    // Handle any potential errors here
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
});
//----------GET API SINGLE ID -----------------
app.get("/explore/:id", async (req, res) => {
  const id = req.params.id;
  console.log("id is", id);
  const query = { _id: new ObjectId(id) }; // Use 'new' with ObjectId
  const product = await tourismSpotCollection.findOne(query);
  res.send(product);
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

// //----------- POST: /api/register -> Create new user ------------
app.post("/api/users", async (req, res) => {
  console.log(req.body);
  try {
    const newUser = new userCollection({
      name: req.body.displayName,
      email: req.body.email,
    });
    console.log("newUser", newUser);

    // Save the new billing document to the database
    const user = await newUser.save();
    console.log("user", user);
    if (user) {
      res.status(200).send({
        success: true, // ***response extra information
        message: "Return a single user",
        data: user,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Product not found",
      });
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
  // console.log("put", user);
  const filter = { email: user.email, name: user.displayName };
  const options = { upsert: true };
  const updateDoc = { $set: user };
  const result = await userCollection.updateOne(filter, updateDoc, options);
  res.json(result);
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
    res.status(500).json({ error: "An error occurred while deleting the order" });
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
