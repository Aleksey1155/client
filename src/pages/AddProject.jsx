import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const AddProject = () => {
    const [project, setProject] = useState({
        title:"",
        description:"",
        start_date:"",
        end_date:"",
        status_id:"",
    })

    const navigate = useNavigate()

    const handleChange = (e) =>{
        setProject(prev=>({...prev, [e.target.name]: e.target.value}));
    }

    const handleClick = async e => {
        e.preventDefault()
        try{
            await axios.post("http://localhost:3001/projects", project)
            navigate("/projects")
        }catch(err){
            console.log(err)
        }
    }

    console.log(project)
    return (

        <div className="form">
            <h1>Add new project</h1>
            <input type="text" placeholder="title" onChange={handleChange} name="title"/>
            <textarea placeholder="description" onChange={handleChange} name="description" />
            <input type="date" placeholder="start_date" onChange={handleChange} name="start_date"/>
            <input type="date" placeholder="end_date" onChange={handleChange} name="end_date"/>
            <input type="number" placeholder="status_id" onChange={handleChange} name="status_id"/>

            <button className="nav-addlink" onClick={handleClick}>Add</button>

        </div>

    )
}

export default AddProject