import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();


app.get('/', (req, res) => {
    res.send('Welcome to the Sparkl Server!');
})

mongoose.connect(process.env.MONGOOSE_CONNECTION,{dbName:"Sparkl"})
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch(err => {
    console.error("Error connecting to MongoDB:", err);
  });



app.listen(2004, () => {
    console.log('🚀 Server is running on port 2004 !!!');
});
