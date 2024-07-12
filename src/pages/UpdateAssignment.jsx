import React, { useState } from "react";
import {useNavigate, useLocation} from "react-router-dom";
import axios from "axios";

const UpdateAssignment = () => {
    const [assignment, setAssignment] = useState({
        task_id:"",
        user_id:"",
        assigned_date:"",
    })

    const navigate = useNavigate()
    const location = useLocation()
    const assignmentId = location.pathname.split("/")[2]
    

    const handleChange = (e) =>{
        setAssignment(prev=>({...prev, [e.target.name]: e.target.value}));
    }

    const handleClick = async e => {
        e.preventDefault()
        try{
            await axios.put("http://localhost:3001/assignments/" + assignmentId, assignment)
            navigate("/assignments")
        }catch(err){
            console.log(err)
        }
    }

    console.log(assignment)
    return (

        <div className="form">
            <h1>Update the Project</h1>
            <input type="number" placeholder="task_id" onChange={handleChange} name="task_id"/>
            <input type="number" placeholder="user_id" onChange={handleChange} name="user_id"/>
            <input type="date" placeholder="assigned_date" onChange={handleChange} name="assigned_date"/>

            <button className="formButton"  onClick={handleClick}>Update</button>

        </div>

    )
}

export default UpdateAssignment