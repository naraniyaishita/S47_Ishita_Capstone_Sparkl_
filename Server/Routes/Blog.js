import { Router } from "express";
import multer from "multer";
import BlogModal from "../Schemas/blogs.schema.js";
import UploadonCloudinary from "../config/cloudinary.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", async (req, res) => {
  try {
    const blogs = await BlogModal.find({ userId: req.userId });
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", upload.array("photos", 12), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files were uploaded." });
  }

  try {
    const uploadResults = await Promise.all(
      req.files.map((file) => UploadonCloudinary(file.buffer))
    );
    const imagepath = uploadResults.map((result) => result.secure_url);
    const { title, content, tags, createdDate } = req.body;

    const blog = await BlogModal.create({
      userId: req.userId,
      title,
      content,
      tags,
      imagepath,
      createdDate,
    });
    res.status(201).json(blog);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Unable to create blog" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const blog = await BlogModal.findOne({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Unable to find blog" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const blog = await BlogModal.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Unable to delete blog" });
  }
});

export default router;
