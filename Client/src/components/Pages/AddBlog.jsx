import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserContext from "../User/UserContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loginfirst from "../Loginfirst";

function AddBlog() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setInputTags] = useState("");
  const [images, setImages] = useState([]);
  const {username, userId } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagsArray = tagsInput.split(" ").map((tag) => tag.trim());
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", JSON.stringify(tagsArray)); 

    images.forEach((image) => {
      formData.append('photos', image);
    });

    const uploadToastId = toast.loading("Uploading blog...");

    try {
      await axios.post(`${import.meta.env.VITE_SERVER}/blog`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.update(uploadToastId, {
        render: "Blog uploaded successfully!",
        type: 'success',
        autoClose: 1000,
        isLoading: false,
        onClose: () => navigate("/blogs"), 
      });
    } catch (error) {
      console.error(error)
      toast.update(uploadToastId, {
        render: "Failed to upload blog. Please try again.",
        type: 'error',
        autoClose: 2000,
        isLoading: false,
      });
    }
  };

  const handleImagesChange = (e) => {
    const filesArray = Array.from(e.target.files);
    setImages(filesArray);
  };

  return username && username.length > 0 ? (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter blog title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Enter blog content"
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter blog tags"
          onChange={(e) => setInputTags(e.target.value)}
        />
        <input type="file" multiple onChange={handleImagesChange} />
        <button type="submit">Submit</button>
      </form>
      <ToastContainer style={{width: '30vw', height:'14vh'}}/>
    </>
  ):<Loginfirst/>
}

export default AddBlog;
