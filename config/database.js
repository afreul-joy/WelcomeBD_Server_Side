require("dotenv").config();

const mongoose = require("mongoose");

const url = process.env.MONGO_URL;
console.log(url);
mongoose.connect(url)
.then(()=>{
  console.log("Connected to the MongoDB Atlas!");
})
.catch((error)=>{
  console.log(error);
  process.exit(1); 
}) 