import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const Add = () => {
    const [book, setBook] = useState({
        title:"",
        descr:"",
        price:null,
        cover:"",
    })

    const navigate = useNavigate()

    const handleChange = (e) =>{
        setBook(prev=>({...prev, [e.target.name]: e.target.value}));
    }

    const handleClick = async e => {
        e.preventDefault()
        try{
            await axios.post("http://localhost:3001/books", book)
            navigate("/")
        }catch(err){
            console.log(err)
        }
    }

    console.log(book)
    return (

        <div className="form">
            <h1>Add</h1>
            <input type="text" placeholder="title" onChange={handleChange} name="title"/>
            <input type="text" placeholder="descr" onChange={handleChange} name="descr"/>
            <input type="number" placeholder="price" onChange={handleChange} name="price"/>
            <input type="text" placeholder="cover" onChange={handleChange} name="cover"/>

            <button className="formButton" onClick={handleClick}>Add</button>

        </div>

    )
}

export default Add