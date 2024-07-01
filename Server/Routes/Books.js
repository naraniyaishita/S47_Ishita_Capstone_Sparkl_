import express from "express";
import { Router } from "express";
import BookModal from "../Schemas/books.schema.js";
const router = Router()

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const books = await BookModal.find({ userId: userId });
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.post('/', (req, res) => {
    BookModal.create(req.body)
      .then(item => res.json(item))
      .catch(err => console.log(err));
})

router.put('/update/:id' , (req, res) => {
    const id = req.params.id
    BookModal.findByIdAndUpdate(id, req.body)
      .then(item => res.json(item))
      .catch(err => console.log(err));
})

router.delete('/delete/:id', (req, res) => {
    BookModal.findByIdAndDelete(req.params.id)
      .then(item => res.json(item))
      .catch(err => console.log(err));
})  

export default router