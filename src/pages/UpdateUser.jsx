import React, { useState } from "react";
import {useNavigate, useLocation} from "react-router-dom";
import axios from "axios";

const UpdateUser = () => {
    const [user, setUser] = useState({
        email:"",
        name:"",
        phone:"",
    })

    const navigate = useNavigate()
    const location = useLocation()
    const userId = location.pathname.split("/")[2]
    

    const handleChange = (e) =>{
        setUser(prev=>({...prev, [e.target.name]: e.target.value}));
    }

    const handleClick = async e => {
        e.preventDefault()
        try{
            await axios.put("http://localhost:3001/users/" + userId, user)
            navigate("/users")
        }catch(err){
            console.log(err)
        }
    }

    console.log(user)
    return (

        <div className="form">
            <h1>Update the User</h1>
            <input type="text" placeholder="name" onChange={handleChange} name="name"/>
            <input type="text" placeholder="email" onChange={handleChange} name="email"/>
            <input type="text" placeholder="phone" onChange={handleChange} name="phone"/>

            <button className="formButton"  onClick={handleClick}>Update</button>

        </div>

    )
}

export default UpdateUser