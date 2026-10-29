import { Router } from "express";
import WatchListModal from "../Schemas/watchlists.schema.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const watchList = await WatchListModal.find({ userId: req.userId });
    res.json(watchList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const watchList = await WatchListModal.create({
      ...req.body,
      userId: req.userId,
    });
    res.status(201).json(watchList);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Unable to create watchlist item" });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const watchList = await WatchListModal.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!watchList) return res.status(404).json({ message: "Watchlist item not found" });
    res.json(watchList);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Unable to update watchlist item" });
  }
});

router.get("/item/:id", async (req, res) => {
  try {
    const watchList = await WatchListModal.findOne({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!watchList) return res.status(404).json({ message: "Watchlist item not found" });
    res.json(watchList);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Unable to find watchlist item" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const watchList = await WatchListModal.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!watchList) return res.status(404).json({ message: "Watchlist item not found" });
    res.json(watchList);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Unable to delete watchlist item" });
  }
});

export default router;
