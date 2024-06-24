import express from "express";
import { Router } from "express";
import multer from "multer";
import BlogModal from "../Schemas/blogs.schema.js";
const router = Router()
import UploadonCloudinary from "../config/cloudinary.js";

router.get("/", (req, res) => {
    BlogModal.find({})
      .then((users) => res.json(users))
      .catch((err) => res.json(err));
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `image-${Date.now()}.${file.originalname}`);
  },
});

const upload = multer({ storage: storage })

router.post("/", upload.array("photos", 12), async (req, res) => {
  console.log("req.body",req.body);
  console.log("req.files",req.files);
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files were uploaded." });
  }
  try {
    const uploadPromises = req.files.map((file) => UploadonCloudinary(file.path));
    const uploadResults = await Promise.all(uploadPromises);
    const imagepaths = uploadResults.map((result) => result.secure_url);

    const {userId,title,content,tags, createdDate, updatedDate } = req.body;

    
    const blogdata = new BlogModal({
      userId : userId,
      title:   title,
      content : content,
      tags:tags,
      imagepath: imagepaths,
      createdDate: createdDate,
      updatedDate: updatedDate,
    });
    await blogdata.save();
    res.status(200).json(blogdata);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});


export default router
