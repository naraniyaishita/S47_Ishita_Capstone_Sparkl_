import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddBlog() {
 const navigate = useNavigate();

 const [title, setTitle] = useState("");
 const [content, setContent] = useState("");
 const [tagsInput, setInputTags] = useState("");
 const [images, setImages] = useState([]);

 const  userId  = "6624c26997d84aa1a02bc970";

 const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(tagsInput);
    const tagsArray = tagsInput.split(" ").map((tag) => tag.trim());
    console.log(tagsArray);

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", tagsArray);


    const imageArray =[]
    images.forEach((image, index) => {
      imageArray.push(image); 
    });
    
    imageArray.forEach((image, index) => {
      formData.append('photos', image);
    })


    try {
      const response = await axios.post("http://localhost:2004/blog", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate("/blogs");
    } catch (error) {
      console.error(error);
    }
 };

 const handleImagesChange = (e) => {
    const filesArray = Array.from(e.target.files);
    setImages(filesArray);
 };

 return (
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
    </>
 );
}

export default AddBlog;
