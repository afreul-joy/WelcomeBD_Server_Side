require("dotenv").config();
require("./config/database");

const express = require("express");
const app = express();
const cors = require("cors");
// const jwt = require("jsonwebtoken");
// const userCollection = require("./models/userCollection");
// const BillingCollection = require("./models/BillingCollection");

const port = 4000; // You can change the port number if needed

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/*  #################################
               CRUD
    #################################
*/
// //----------- POST: /api/add-billing -> Create a new billing entry------------
// app.post("/api/add-billing", async (req, res) => {
//   try {
//     // Create a new billing document
//     const newBilling = new BillingCollection({
//       name: req.body.name,
//       email: req.body.email,
//       phone: req.body.phone,
//       amount: req.body.amount,
//     });

//     // Save the new billing document to the database
//     const product = await newBilling.save();
//     if (product) {
//       res.status(200).send({
//         success: true, // ***response extra information
//         message: "Return a single product",
//         data: product,
//       });
//     } else {
//       res.status(400).send({
//         success: false,
//         message: "Product not found",
//       });
//     }
//   } catch (error) {
//     res.status(500).send({
//       message: error.message,
//     });
//   }
// });

// // --------------GET: /products -> Return all the products-----------
// app.get("/api/billing-list", async (req, res) => {
//   try {
//     const product = await BillingCollection.find();
//     if (product) {
//       res.status(200).send({
//         success: true, // ***response extra information
//         message: "Return all the product",
//         data: product,
//       });
//     } else {
//       res.status(400).send({
//         success: false,
//         message: "Product not found",
//       });
//     }
//   } catch (error) {
//     res.status(500).send({
//       message: error.message,
//     });
//   }
// });
// //------------- GET SINGLE ID Operation ---------------
// app.get("/api/billing-list/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     //console.log(id);
//     const product = await BillingCollection.findOne({ _id: id });
//     if (product) {
//       res.status(200).send({
//         success: true, // ***response extra information
//         message: "Return a single product",
//         data: product,
//       });
//     } else {
//       res.status(400).send({
//         success: false,
//         message: "Product not found",
//       });
//     }
//   } catch (error) {
//     res.status(500).send({
//       message: error.message,
//     });
//   }
// });
// //------------- Update Operation ---------------
// app.put("/api/update-billing/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     //console.log(id);
//     // in update method: 1st need id, 2nd set new value for this update;
//     const updatedProduct = await BillingCollection.findByIdAndUpdate(
//       { _id: id },
//       {
//         $set: {
//           name: req.body.name,
//           email: req.body.email,
//           phone: req.body.phone,
//           amount: req.body.amount,
//         },
//       },
//       { new: true } // showing updated data in api
//     );
//     if (updatedProduct) {
//       res.status(200).send({
//         success: true,
//         message: "Updated successfully",
//         data: updatedProduct,
//       });
//     } else {
//       res.status(400).send({
//         success: false,
//         message: "Product was not updated with this id",
//       });
//     }
//   } catch (error) {
//     res.status(500).send({
//       message: error.message,
//     });
//   }
// });
// //------------- Delete Operation ---------------
// app.delete("/api/delete-billing/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const productDelete = await BillingCollection.findByIdAndDelete({ _id: id }); // showing details of deleted product
//     // const productDelete = await products.deleteOne({_id: id}); // delete normally showing "acknowledgement:true"

//     if (productDelete) {
//       res.status(200).send({
//         success: true,
//         message: "Delete successfully",
//         data: productDelete,
//       });
//     } else {
//       res.status(400).send({
//         success: false,
//         message: "Product was not deleted with this id",
//       });
//     }
//   } catch (error) {
//     res.status(500).send({
//       message: error.message,
//     });
//   }
// });
// /*  #################################
//           Authentication
//     #################################
// */
// app.post("/register", async (req, res) => {
//   console.log(req.body);
//   try {
//     const user = await userCollection.findOne({ email: req.body.email });

//     if (user) {
//       return res.status(300).send("user already registered");
//     } else {
//       const newUser = new userCollection({
//         name: req.body.name,
//         password: req.body.password,
//         email: req.body.email,
//       });
//       await newUser
//         .save()
//         .then((user) => {
//           res.send({
//             success: true,
//             message: "User saved successfully",
//             user: {
//               id: user._id,
//               username: user.username,
//             },
//           });
//         })
//         .catch((error) => {
//           res.send("error: " + error.message);
//         });
//     }
//   } catch (error) {
//     res.send("error: " + error.message);
//   }
// });

// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await userCollection.findOne({
//       email: email,
//       password: password,
//     });
//     if (user && user.password === password) {
//       const token = jwt.sign(
//         {
//           name: user.name,
//           email: user.email,
//         },
//         process.env.SECRET_KEY,
//         {
//           expiresIn: "2d",
//         }
//       );
//       res.status(200).json({ status: "valid user", JWT_TOKEN: token });
//     } else {
//       res.status(501).json({ status: "Not valid user" });
//     }
//   } catch (error) {
//     res.status(500).send({
//       message: error.message,
//     });
//   }
// });

// // Middleware function to verify the token
// const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization; // Get the token from the request headers

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.SECRET_KEY); // Verify the token using the secret key
//     req.user = decoded; // Attach the decoded user information to the request object
//     next(); // Call the next middleware or route handler
//   } catch (error) {
//     return res.status(403).json({ message: "Invalid token" });
//   }
// };

// // Check if user is already logged in
// app.get("/auth", verifyToken, (req, res) => {
//   // If the token is valid, the user is logged in
//   res.json({ loggedIn: true, user: req.user });
// });


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
