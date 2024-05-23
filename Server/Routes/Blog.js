import express from "express";
import { Router } from "express";
import BlogModal from "../Schemas/blogs.schema.js";
const router = Router()

router.get("/", (req, res) => {
    BlogModal.find({})
      .then((users) => res.json(users))
      .catch((err) => res.json(err));
});

export default router
