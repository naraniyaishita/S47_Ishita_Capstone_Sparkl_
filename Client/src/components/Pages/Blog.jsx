import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../Styles/Blog.css'
import axios from 'axios'
import UserContext from '../User/UserContext';
import Loginfirst from "../Loginfirst";

function Blog() {
    const { id } = useParams()
    const [Blogs, setBlogs] = useState([]);
    const { username ,userId } = useContext(UserContext);


    const navigate = useNavigate();
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_SERVER}/blog/${userId}`)
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

    const blog1 = Blogs.find(blog => blog._id === String(id));

    const handleDelete  = async (id) => {
        try {
          await axios.delete(`${import.meta.env.VITE_SERVER}/blog/delete/${id}`).then(res => {
            navigate('/blogs')
          })
          
        } catch (error) {
          console.log(error);
        }
      };
    if (!blog1) {
        return <div>Blog not found</div>;
    }

    return  username && username.length > 0 ? (
        <div className='Blog'>
            <div className='blog-top'>

            <button onClick={()=>navigate('/blogs')} >Back</button>
            <h2> {blog1.title}</h2>
            <button onClick={() => handleDelete(blog1._id)}>Delete</button>
            </div>

            
            <p className='blog-content'>{blog1.content}</p>
            <p>Tags: {blog1.tags.join(', ')}</p>
            <p>Created Date: {formatDate(blog1.createdDate)}</p>

            <div>
                {blog1.imagepath && blog1.imagepath.map((image, index) => (
                    <img key={index} src={image} className='blog-image' alt="" />
                ))}
            </div>
        </div>
    ) : <Loginfirst />
}

export default Blog