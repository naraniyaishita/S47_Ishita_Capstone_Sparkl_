import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import UserModal from "./Schemas/users.schema.js";
import BlogModal from "./Schemas/blogs.schema.js";
import BookModal from "./Schemas/books.schema.js";
import WatchListModal from "./Schemas/watchlists.schema.js";

dotenv.config();
const app = express();

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

app.get("/", (req, res) => {
  res.send("Welcome to the Sparkl Server");
});
app.get("/user", (req, res) => {
  UserModal.find({})
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});
app.get("/blog", (req, res) => {
  BlogModal.find({})
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});
app.get("/books", (req, res) => {
  BookModal.find({})
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});
app.get("/watchList", (req, res) => {
  WatchListModal.find({})
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});

app.listen(2004, () => {
  console.log("🚀 Server is running on port 2004 !!!");
});
