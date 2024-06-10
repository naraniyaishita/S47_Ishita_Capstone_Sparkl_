import express from "express";
import { Router } from "express";
import WatchListModal from "../Schemas/watchlists.schema.js";
const router = Router()

router.get("/", (req, res) => {
    WatchListModal.find({})
      .then((users) => res.json(users))
      .catch((err) => res.json(err));
  });


  router.post("/", (req, res) => {
    WatchListModal.create(req.body)
      .then((item) => res.json(item))
      .catch((err) => res.status(400).json(err));
    console.log(req.body);
  });
  export default router
  