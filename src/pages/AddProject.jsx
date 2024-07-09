import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const AddProject = () => {
    const [project, setProject] = useState({
        title:"",
        description:"",
        start_date:"",
        end_date:"",
        status:"",
    })

    const navigate = useNavigate()

    const handleChange = (e) =>{
        setProject(prev=>({...prev, [e.target.name]: e.target.value}));
    }

    const handleClick = async e => {
        e.preventDefault()
        try{
            await axios.post("http://localhost:3001/projects", project)
            navigate("/")
        }catch(err){
            console.log(err)
        }
    }

    console.log(project)
    return (

        <div className="form">
            <h1>Add new project</h1>
            <input type="text" placeholder="title" onChange={handleChange} name="title"/>
            <input type="text" placeholder="description" onChange={handleChange} name="description"/>
            <input type="date" placeholder="start_date" onChange={handleChange} name="start_date"/>
            <input type="date" placeholder="end_date" onChange={handleChange} name="end_date"/>
            <input type="text" placeholder="status" onChange={handleChange} name="status"/>

            <button className="formButton" onClick={handleClick}>Add</button>

        </div>

    )
}

export default AddProject