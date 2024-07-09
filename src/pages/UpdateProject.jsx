import React, { useState } from "react";
import {useNavigate, useLocation} from "react-router-dom";
import axios from "axios";

const UpdateProject = () => {
    const [project, setProject] = useState({
        title:"",
        description:"",
        start_date:"",
        end_date:"",
        status:"",
    })

    const navigate = useNavigate()
    const location = useLocation()
    const projectId = location.pathname.split("/")[2]
    

    const handleChange = (e) =>{
        setProject(prev=>({...prev, [e.target.name]: e.target.value}));
    }

    const handleClick = async e => {
        e.preventDefault()
        try{
            await axios.put("http://localhost:3001/projects/" + projectId, project)
            navigate("/")
        }catch(err){
            console.log(err)
        }
    }

    console.log(project)
    return (

        <div className="form">
            <h1>Update the Project</h1>
            <input type="text" placeholder="title" onChange={handleChange} name="title"/>
            <input type="text" placeholder="description" onChange={handleChange} name="description"/>
            <input type="date" placeholder="start_date" onChange={handleChange} name="start_date"/>
            <input type="date" placeholder="end_date" onChange={handleChange} name="end_date"/>
            <input type="text" placeholder="status" onChange={handleChange} name="status"/>

            <button className="formButton"  onClick={handleClick}>Update</button>

        </div>

    )
}

export default UpdateProject