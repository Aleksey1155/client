import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const AddUser = () => {
    const [user, setUser] = useState({
        email:"",
        name:"",
        phone:"",
        role_id:"",
    })

    const navigate = useNavigate()

    const handleChange = (e) =>{
        setUser(prev=>({...prev, [e.target.name]: e.target.value}));
    }

    const handleClick = async e => {
        e.preventDefault()
        try{
            await axios.post("http://localhost:3001/users", user)
            navigate("/users")
        }catch(err){
            console.log(err)
        }
    }

    console.log(user)
    return (

        <div className="form">
            <h1>Add new user</h1>
            <input type="text" placeholder="name" onChange={handleChange} name="name"/>
            <input type="text" placeholder="email" onChange={handleChange} name="email"/>
            <input type="text" placeholder="phone" onChange={handleChange} name="phone"/>
            <input type="number" placeholder="role_id" onChange={handleChange} name="role_id"/>

            <button className="nav-addlink" onClick={handleClick}>Add</button>

        </div>

    )
}

export default AddUser