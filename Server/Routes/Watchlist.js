import express from "express";
import { Router } from "express";
import WatchListModal from "../Schemas/watchlists.schema.js";
const router = Router();

router.get("/", (req, res) => {
  WatchListModal.find({})
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});

router.post("/", (req, res) => {
  WatchListModal.create(req.body)
    .then((item) => res.json(item))
    .catch((err) => res.status(400).json(err));
});

router.put("/update/:id", (req, res) => {
  const id = req.params.id;
  WatchListModal.findByIdAndUpdate(id, req.body)
    .then((item) => res.json(item))
    .catch((err) => console.log(err));
});

router.get("/item/:id", (req, res) => {
  const id = req.params.id;
  WatchListModal.findById(id)
    .then((item) => res.json(item))
    .catch((err) => res.status(400).json(err));
});

router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  WatchListModal.findByIdAndDelete(id)
    .then((item) => res.json(item))
    .catch((err) => res.status(400).json(err));
});

export default router;
