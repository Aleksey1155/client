import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const AddTask = () => {
    const [task, setTask] = useState({
        project_id:"",
        title:"",
        description:"",
        start_date:"",
        end_date:"",
        priority_id:"",
        status_id:"",
    })

    const navigate = useNavigate()

    const handleChange = (e) =>{
        setTask(prev=>({...prev, [e.target.name]: e.target.value}));
    }

    const handleClick = async e => {
        e.preventDefault()
        try{
            await axios.post("http://localhost:3001/tasks", task)
            navigate("/tasks")
        }catch(err){
            console.log(err)
        }
    }

    console.log(task)
    return (

        <div className="form">
            <h1>Add new task</h1>
            <input type="number" placeholder="project_id" onChange={handleChange} name="project_id"/>
            <input type="text" placeholder="title" onChange={handleChange} name="title"/>
            <textarea placeholder="description" onChange={handleChange} name="description" />
            <input type="date" placeholder="start_date" onChange={handleChange} name="start_date"/>
            <input type="date" placeholder="end_date" onChange={handleChange} name="end_date"/>
            <input type="number" placeholder="priority_id" onChange={handleChange} name="priority_id"/>
            <input type="number" placeholder="status_id" onChange={handleChange} name="status_id"/>

            <button className="nav-addlink" onClick={handleClick}>Add</button>

        </div>

    )
}

export default AddTask