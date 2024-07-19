import React, { useState, useEffect, useContext } from 'react'
import Navbar from '../Navbar'
import '../Styles/Blogs.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import  UserContext  from '../User/UserContext'

function BlogsPage() {
  const navigate = useNavigate()
  const [Blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true)
  const { userId } = useContext(UserContext);


  useEffect(() => {
    axios.get(`${import.meta.env.VITE_SERVER}/blog/${userId}`)
      .then(blogs =>  {
        setBlogs(blogs.data)
        setLoading(false)
      })
      .catch(err => {console.log(err)
        setLoading(false)
      })
      
  }, [userId])

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
    <div className='BlogTopDiv'>
    <h2>Your Blogs</h2>
    <button className='addBlog' onClick={() => navigate('/blogs/add')}>ADD</button>
    </div>

    
    {loading ? (
        <div className='loading'>
          <p>Loading blogs...</p>
        </div>
      ) : (
        <div className="blogs-container">
          {Blogs.map((blog, index) => (
            <div key={index} className="blog" onClick={() => navigate(`/blogs/${blog._id}`)}>
              <div className='blogImages'>
                {blog.imagepath && <img src={blog.imagepath[0]} alt="" className='blogImage' />}
              </div>
              <div className='blogContent'>
                <h3>{blog.title}</h3>
                <p>{blog.content}</p>
                <p>Tags: {blog.tags.join(', ')}</p>
                <p>Created Date: {formatDate(blog.createdDate)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
      }

export default BlogsPage
