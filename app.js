require("dotenv").config();
require("./config/database");

const express = require("express");
const app = express();
const userCollection = require("./models/userCollection");

const port = 9000; // You can change the port number if needed

const bodyParser = require("body-parser")
const cors = require("cors")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors())

//-----------------STRIPE PAYMENT ----------------
const stripe = require("stripe")("sk_test_51LclMjBLMFfgNXFxKTR7J0t8YucyD3nGk4adO8QwwiSDdIPfEdoLRtcsEU6lUU3h4oY0PQfg1FsnuckTB9itaHCt00UdYDm3bU")

app.post("/payment", cors(), async (req, res) => {
	let { amount, id } = req.body
	try {
		const payment = await stripe.paymentIntents.create({
			amount,
			currency: "USD",
			description: "WelcomeBD company",
			payment_method: id,
			confirm: true,
      return_url: "https://yourwebsite.com/success",
		})
		console.log("Payment", payment)
		res.json({
			message: "Payment successful",
			success: true
		})
	} catch (error) {
		console.log("Error", error)
		res.json({
			message: "Payment failed",
			success: false
		})
	}
})



// //----------- POST: /api/register -> Create new user ------------
app.post("/api/users", async (req, res) => {
  console.log(req.body);
  try {
    const newUser = new userCollection({
      name: req.body.displayName,
      email: req.body.email,
    });
    console.log('newUser', newUser);

    // Save the new billing document to the database
    const user = await newUser.save();
    console.log('user', user);
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
      const result = await userCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
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
