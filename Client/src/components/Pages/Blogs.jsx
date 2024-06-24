import React, { useState, useEffect, useContext } from 'react'
import Navbar from '../Navbar'
import '../Styles/Blogs.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function BlogsPage() {
  const navigate = useNavigate()
  const [Blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:2004/blog`)
      .then(blogs =>  setBlogs(blogs.data))
      .catch(err => console.log(err))
  }, [])

  function formatDate(dateString) {
    const formattedDate = new Date(dateString);
    return formattedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  return (
    <>
    <Navbar/>
    <button>ADD</button>

    <h2>Your Blogs</h2>
    <div className="blogs-container">
      {Blogs.map((blog, index) => (
        
        <div key={index} className="blog" onClick={() => navigate(`/blogs/${blog._id}`)}>
          {console.log(blog)}
          <div className='blogImages'>
            {blog.imagepath && <img src={blog.imagepath[0]} alt="" className='blogImage'/>}
      
          </div>
          <div className='blogContent'>
          <h3>{blog.title}</h3>
          <p>{blog.content}</p>          
          <p>Tags: {blog.tags.join(', ')}</p>
          <p>Created Date: {formatDate(blog.createdDate)}</p>
          <p>Updated Date: {formatDate(blog.updatedDate)}</p>
          </div>
        </div>
      ))}
    </div>
    </>
  )
      }

export default BlogsPage
