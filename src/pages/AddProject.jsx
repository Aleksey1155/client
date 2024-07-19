import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddProject = () => {
    const [project, setProject] = useState({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        status_id: "",
    });

    const [statuses, setStatuses] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const res = await axios.get("http://localhost:3001/project_statuses");
                setStatuses(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchStatuses();
    }, []);

    const handleChange = (e) => {
        setProject((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3001/projects", project);
            navigate("/projects");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="form">
            <h1>Add new project</h1>
            <input type="text" placeholder="title" onChange={handleChange} name="title" />
            <textarea placeholder="description" onChange={handleChange} name="description" />
            <input type="date" placeholder="start_date" onChange={handleChange} name="start_date" />
            <input type="date" placeholder="end_date" onChange={handleChange} name="end_date" />
            <select name="status_id" onChange={handleChange} value={project.status_id}>
                <option value="" disabled>Select status</option>
                {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                        {status.status_name}
                    </option>
                ))}
            </select>
            <button className="nav-addlink" onClick={handleClick}>Add</button>
        </div>
    );
};

export default AddProject;
