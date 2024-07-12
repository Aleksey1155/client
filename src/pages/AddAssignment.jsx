import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const AddAssignment = () => {
    const [assignment, setAssignment] = useState({
        task_id:"",
        user_id:"",
        assigned_date:"",
       
    })

    const navigate = useNavigate()

    const handleChange = (e) =>{
        setAssignment(prev=>({...prev, [e.target.name]: e.target.value}));
    }

    const handleClick = async e => {
        e.preventDefault()
        try{
            await axios.post("http://localhost:3001/assignments", assignment)
            navigate("/assignments")
        }catch(err){
            console.log(err)
        }
    }

    console.log(assignment)
    return (

        <div className="form">
            <h1>Add new project</h1>
            <input type="number" placeholder="task_id" onChange={handleChange} name="task_id"/>
            <input type="number" placeholder="user_id" onChange={handleChange} name="user_id"/>
            <input type="date" placeholder="assigned_date" onChange={handleChange} name="assigned_date"/>

            <button className="formButton" onClick={handleClick}>Add</button>

        </div>

    )
}

export default AddAssignment