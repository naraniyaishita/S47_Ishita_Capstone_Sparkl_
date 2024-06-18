import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import UserRoute from './Routes/User.js'
import BookRoute from './Routes/Books.js'
import BlogRoute from './Routes/Blog.js'
import WatchListRoute from './Routes/Watchlist.js'


dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
  res.send("Welcome to the Sparkl Server!");
});

mongoose
  .connect(process.env.MONGOOSE_CONNECTION, { dbName: "Sparkl" })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

  app.use('/user',UserRoute)
  app.use('/blog', BlogRoute)
  app.use('/books', BookRoute)
  app.use('/watchList', WatchListRoute)

app.listen(2004, () => {
  console.log("🚀 Server is running on port 2004 !!!");
});
