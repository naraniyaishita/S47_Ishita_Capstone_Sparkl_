import express from "express";
import { Router } from "express";
import BookModal from "../Schemas/books.schema.js";
const router = Router()

router.get('/', (req, res) => {
    BookModal.find({})
    .then(books => res.json(books))
    .catch(err => res.json(err))
})

export default router