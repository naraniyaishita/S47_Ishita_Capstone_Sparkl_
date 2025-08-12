import React, { useState, useEffect, useContext } from "react";
import Navbar from "../Navbar";
import "../Styles/Blogs.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserContext from "../User/UserContext";
import Loginfirst from "../Loginfirst";

function BlogsPage() {
  const navigate = useNavigate();
  const [Blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { username, userId } = useContext(UserContext);

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

  return username && username.length > 0 ? (
    <>
      <div className="blogs-page-container">
        <Navbar />
        <div className="BlogTopDiv">
          <h2>Your Blogs</h2>
          <button className="addBlog" onClick={() => navigate("/blogs/add")}>
            ADD
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <p>Loading blogs...</p>
          </div>
        ) : (
          <div className="blogs-container">
            {Blogs.length === 0 ? (
              <div className="no-blogs">
                <h3>No blogs yet!</h3>
                <p>Start sharing your thoughts with the world</p>
                <button onClick={() => navigate("/blogs/add")}>
                  Create Your First Blog
                </button>
              </div>
            ) : (
              Blogs.map((blog, index) => (
                <div
                  key={index}
                  className="blog"
                  onClick={() => navigate(`/blogs/${blog._id}`)}
                >
                  <div className="blogImages">
                    {blog.imagepath && (
                      <img
                        src={blog.imagepath[0]}
                        alt=""
                        className="blogImage"
                      />
                    )}
                  </div>
                  <div className="blogContent">
                    <h3>{blog.title}</h3>
                    <p>{blog.content}</p>
                    <div className="blog-meta">
                      <div className="blog-tags">
                        {blog.tags.map((tag, tagIndex) => (
                          <span key={tagIndex}>{tag}</span>
                        ))}
                      </div>
                      <div className="blog-date">
                        {formatDate(blog.createdDate)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  ) : (
    <Loginfirst />
  );
}

export default BlogsPage;
