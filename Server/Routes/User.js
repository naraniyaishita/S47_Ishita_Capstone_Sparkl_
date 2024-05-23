import express from "express";
import { Router } from "express";
import UserModal from "../Schemas/users.schema.js";
const router = Router()

router.get("/", (req, res) => {
    UserModal.find({})
      .then((users) => res.json(users))
      .catch((err) => res.json(err));
  });

  export default router