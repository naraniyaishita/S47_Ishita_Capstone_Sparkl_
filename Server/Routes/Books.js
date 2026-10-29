import { Router } from "express";
import BookModal from "../Schemas/books.schema.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const books = await BookModal.find({ userId: req.userId });
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const book = await BookModal.create({ ...req.body, userId: req.userId });
    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Unable to create book" });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const book = await BookModal.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Unable to update book" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const book = await BookModal.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Unable to delete book" });
  }
});

export default router;
