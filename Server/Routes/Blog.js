import express from "express";
import { Router } from "express";
import multer from "multer";
import BlogModal from "../Schemas/blogs.schema.js";
const router = Router()
import UploadonCloudinary from "../config/cloudinary.js";

router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
     const blog = await BlogModal.find({ userId: userId });
     res.json(blog)
  } catch (error) {
     console.error(error);
     res.status(500).send('Server error');
  }
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
    res.status(400).json(error);
  }
});
router.get('/:_id', async (req, res) => {
  const _id = req.params._id;
  try {
     const blog = await BlogModal.find({_id : _id});
     res.json(blog)
  } catch (error) {
     console.error(error);
     res.status(500).send('Server error');
  }
});

router.delete('/delete/:id', (req, res) => {
  const id = req.params.id
  BlogModal.findByIdAndDelete(id)
      .then(item => res.json(item))
      .catch(err => console.log(err));
    
})

export default router
