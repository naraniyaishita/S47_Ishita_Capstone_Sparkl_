import express from "express";
import { Router } from "express";
import UserModal from "../Schemas/users.schema.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const router = Router()

router.get("/", (req, res) => {
    UserModal.find({})
      .then((users) => res.json(users))
      .catch((err) => res.json(err));
  });

  router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await UserModal.find({ _id: userId });
        res.json(user);
     } catch (error) {
        console.error(error);
     }
})


router.post('/register', async(req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ "message": "All fields must be filled" });
    }
    try {
        const existingUser = await UserModal.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ "message": "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10); 
        const newUser = new UserModal({
            name,
            email,
            password: hashedPassword 
        });
        await newUser.save();

        const token = jwt.sign({ _id: newUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

        res.status(200).json({ user: newUser, token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
})

router.post('/login', async(req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ "message": "All fields must be filled" });
    }
    try { 
        const existingUser = await UserModal.findOne({ email: email });
        if (!existingUser) {
            return res.status(400).json({ "message": "User doesn't exist" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ "message": "Invalid credentials" });
        }
        const token = jwt.sign({ _id: existingUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        res.status(200).json({ user: existingUser, token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    } 
}
)

  export default router