import express from "express";
import { Router } from "express";
import WatchListModal from "../Schemas/watchlists.schema.js";
const router = Router()

router.get("/", (req, res) => {
    WatchListModal.find({})
      .then((users) => res.json(users))
      .catch((err) => res.json(err));
  });

  export default router
  