import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Loginfirst from "../Loginfirst";

function EditWatch() {

  const navigate = useNavigate();
  const {id} = useParams()
  const [title, setTitle] = useState('')
  const [type, setType] = useState('')
  const [coverImageURL, setCoverImageURL] = useState('')
  const [genre, setGenre] = useState([])
  const [whereTo, setWhereTo] = useState('')
  
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_SERVER}/watchList/item/${id}`)
    .then(res => {
      setTitle(res.data.title)
      setType(res.data.type)
      setCoverImageURL(res.data.coverImageURL)
      setGenre(res.data.genre)
      setWhereTo(res.data.whereTo)
      
    })
    .catch(err => console.log(err))
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${import.meta.env.VITE_SERVER}/watchList/update/${id}`, {title, type, coverImageURL, genre, whereTo});
      console.log(response.data);

      navigate('/watchlist')

    } catch (error) {
      console.error(error);
    }
  }
  return  username && username.length > 0 ?(
    <>
    <form onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="text" value={type} onChange={(e) => setType(e.target.value)} />
      <input type="text" value={coverImageURL} onChange={(e) => setCoverImageURL(e.target.value)} />
      <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} />
      <select value={whereTo} onChange={(e) => setWhereTo(e.target.value)} >
        <option value="Netflix">Netflix</option>
        <option value="HBO Max">HBO Max</option>
        <option value="Disney+">Disney+</option>
        <option value="Hulu">Hulu</option>
        <option value="Amazon Prime">Amazon Prime</option>
        <option value="Other">Other</option>
      </select>
      <button type='submit'>Submit</button>
    </form>
    </>
  ) : <Loginfirst />
}

export default EditWatch