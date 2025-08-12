import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserContext from "../User/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loginfirst from "../Loginfirst";
import "../Styles/Add.css";
function AddBlog() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setInputTags] = useState("");
  const [images, setImages] = useState([]);
  const { username, userId } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagsArray = tagsInput.split(" ").map((tag) => tag.trim());
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("title", title);
    formData.append("content", content);
    tagsArray.forEach((tag) => formData.append("tags", tag));

    images.forEach((image) => {
      formData.append("photos", image);
    });

    const uploadToastId = toast.loading("Uploading blog...");

    try {
      await axios.post(`${import.meta.env.VITE_SERVER}/blog`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.update(uploadToastId, {
        render: "Blog uploaded successfully!",
        type: "success",
        autoClose: 1000,
        isLoading: false,
        onClose: () => navigate("/blogs"),
      });
    } catch (error) {
      console.error(error);
      toast.update(uploadToastId, {
        render: "Failed to upload blog. Please try again.",
        type: "error",
        autoClose: 2000,
        isLoading: false,
      });
    }
  };

  const handleImagesChange = (e) => {
    const filesArray = Array.from(e.target.files);
    setImages(filesArray);
  };

  const handleInputFocus = (e) => {
    e.target.closest(".form-group").style.transform = "scale(1.02)";
  };

  const handleInputBlur = (e) => {
    e.target.closest(".form-group").style.transform = "scale(1)";
  };

  return username && username.length > 0 ? (
    <>
      <form onSubmit={handleSubmit} className="AddBlogForm">
        <div className="form-container">
          <h1 className="form-title">Create New Blog</h1>

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              className="styled-input"
              placeholder="Enter an engaging blog title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              className="styled-textarea"
              placeholder="Share your thoughts and ideas here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              id="tags"
              type="text"
              className="styled-input"
              placeholder="Enter tags separated by spaces (e.g., tech lifestyle travel)"
              value={tagsInput}
              onChange={(e) => setInputTags(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          <div className="form-group">
            <label>Choose Images</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="images"
                multiple
                onChange={handleImagesChange}
              />
              <label
                htmlFor="images"
                className={`file-input-label ${
                  images.length > 0 ? "has-files" : ""
                }`}
              >
                <span className="file-icon">
                  {images.length > 0 ? "✓" : "📁"}
                </span>
                <span>
                  {images.length > 0
                    ? `${images.length} file(s) selected`
                    : "Choose images or drag & drop here"}
                </span>
              </label>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Publish Blog
          </button>
        </div>
      </form>

      <ToastContainer style={{ width: "30vw", height: "14vh" }} />
    </>
  ) : (
    <Loginfirst />
  );
}

export default AddBlog;
