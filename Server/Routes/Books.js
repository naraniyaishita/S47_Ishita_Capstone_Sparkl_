import express from "express";
import { Router } from "express";
import BookModal from "../Schemas/books.schema.js";
const router = Router()

router.get('/', (req, res) => {
    BookModal.find({})
    .then(books => res.json(books))
    .catch(err => res.json(err))
})

router.post('/', (req, res) => {
    BookModal.create(req.body)
      .then(item => res.json(item))
      .catch(err => res.status(400).json(err));
})

router.put('/update/:id' , (req, res) => {
    const id = req.params.id
    BookModal.findByIdAndUpdate(id, req.body)
      .then(item => res.json(item))
      .catch(err => console.log(err));
})

export default router