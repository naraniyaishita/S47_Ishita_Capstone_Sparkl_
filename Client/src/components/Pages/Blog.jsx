import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Styles/Blog.css";
import axios from "axios";
import UserContext from "../User/UserContext";
import Loginfirst from "../Loginfirst";

function Blog() {
  const { id } = useParams();
  const [Blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { username, userId } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER}/blog/${userId}`)
      .then((blogs) => {
        setBlogs(blogs.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [userId]);

  function formatDate(dateString) {
    const formattedDate = new Date(dateString);
    return formattedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const blog1 = Blogs.find((blog) => blog._id === String(id));

  const handleDelete = async (id) => {
    try {
      await axios
        .delete(`${import.meta.env.VITE_SERVER}/blog/delete/${id}`)
        .then((res) => {
          navigate("/blogs");
        });
    } catch (error) {
    }
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    handleDelete(blog1._id);
  };

  if (loading) {
    return (
      <div className="blog-loading">
        <div className="loading-spinner"></div>
        <p>Loading blog...</p>
      </div>
    );
  }

  if (!blog1) {
    return (
      <div className="blog-not-found">
        <h2>Blog not found</h2>
        <p>The blog you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate("/blogs")} className="back-btn">
          Back to Blogs
        </button>
      </div>
    );
  }

  return username && username.length > 0 ? (
    <>
      <div className="Blog">
        <div className="blog-top">
          <button onClick={() => navigate("/blogs")} className="back-btn">
            ← Back
          </button>
          <h2>{blog1.title}</h2>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="delete-btn"
          >
            Delete
          </button>
        </div>

        <div className="blog-content-container">
          <p className="blog-content">{blog1.content}</p>

          <div className="blog-meta">
            <div className="blog-tags">
              <span className="blog-tags-label">Tags:</span>
              {blog1.tags.map((tag, index) => (
                <span key={index} className="blog-tag">
                  {tag}
                </span>
              ))}
            </div>
            <div className="blog-date">{formatDate(blog1.createdDate)}</div>
          </div>
        </div>

        {blog1.imagepath && blog1.imagepath.length > 0 && (
          <div className="blog-images">
            {blog1.imagepath.map((image, index) => (
              <img
                key={index}
                src={image}
                className="blog-image"
                alt={`Blog image ${index + 1}`}
                onClick={() => window.open(image, "_blank")}
              />
            ))}
          </div>
        )}

        {showDeleteModal && (
          <div
            className="delete-modal"
            onClick={() => setShowDeleteModal(false)}
          >
            <div
              className="delete-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Delete Blog?</h3>
              <p>
                Are you sure you want to delete this blog? This action cannot be
                undone.
              </p>
              <div className="delete-modal-buttons">
                <button
                  className="cancel-delete"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button className="confirm-delete" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  ) : (
    <Loginfirst />
  );
}

export default Blog;
