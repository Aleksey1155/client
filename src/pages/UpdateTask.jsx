import React, { useState } from "react";
import {useNavigate, useLocation} from "react-router-dom";
import axios from "axios";

const UpdateTask = () => {
    const [task, setTask] = useState({
        project_id:"",
        title:"",
        description:"",
        start_date:"",
        end_date:"",
        priority:"",
        status:"",
    })

    const navigate = useNavigate()
    const location = useLocation()
    const taskId = location.pathname.split("/")[2]
    

    const handleChange = (e) =>{
        setTask(prev=>({...prev, [e.target.name]: e.target.value}));
    }

    const handleClick = async e => {
        e.preventDefault()
        try{
            await axios.put("http://localhost:3001/tasks/" + taskId, task)
            navigate("/tasks")
        }catch(err){
            console.log(err)
        }
    }

    console.log(task)
    return (

        <div className="form">
            <h1>Update the Task</h1>
            <input type="number" placeholder="project_id" onChange={handleChange} name="project_id"/>
            <input type="text" placeholder="title" onChange={handleChange} name="title"/>
            <input type="text" placeholder="description" onChange={handleChange} name="description"/>
            <input type="date" placeholder="start_date" onChange={handleChange} name="start_date"/>
            <input type="date" placeholder="end_date" onChange={handleChange} name="end_date"/>
            <input type="text" placeholder="priority" onChange={handleChange} name="priority"/>
            <input type="text" placeholder="status" onChange={handleChange} name="status"/>
            <button className="formButton"  onClick={handleClick}>Update</button>

        </div>

    )
}

export default UpdateTask