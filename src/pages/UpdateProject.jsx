import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const UpdateProject = () => {
    const [project, setProject] = useState({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        status_id: "",
    });

    const [statuses, setStatuses] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();
    const projectId = location.pathname.split("/")[2];

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/projects/${projectId}`);
                const projectData = res.data;
                setProject({
                    title: projectData.title,
                    description: projectData.description,
                    start_date: projectData.start_date ? new Date(projectData.start_date).toISOString().split('T')[0] : "",
                    end_date: projectData.end_date ? new Date(projectData.end_date).toISOString().split('T')[0] : "",
                    status_id: projectData.status_id,
                });
            } catch (err) {
                console.log(err);
            }
        };

        const fetchStatuses = async () => {
            try {
                const res = await axios.get("http://localhost:3001/project_statuses");
                setStatuses(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchProject();
        fetchStatuses();
    }, [projectId]);

    const handleChange = (e) => {
        setProject(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3001/projects/${projectId}`, project);
            navigate("/projects");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="form">
            <h1>Update the Project</h1>
            <input
                type="text"
                placeholder="title"
                value={project.title}
                onChange={handleChange}
                name="title"
            />
            <textarea
                placeholder="description"
                value={project.description}
                onChange={handleChange}
                name="description"
            />
            <input
                type="date"
                value={project.start_date}
                onChange={handleChange}
                name="start_date"
            />
            <input
                type="date"
                value={project.end_date}
                onChange={handleChange}
                name="end_date"
            />
            <select name="status_id" 
            onChange={handleChange} 
            value={project.status_id}>
                {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                        {status.status_name}
                    </option>
                ))}
            </select>
            <button className="nav-addlink" onClick={handleClick}>Update</button>
        </div>
    );
};

export default UpdateProject;
