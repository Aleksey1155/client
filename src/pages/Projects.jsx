import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Projects = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchAllProjects = async () => {
            try {
                const res = await axios.get("http://localhost:3001/projects");
                setProjects(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchAllProjects();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete("http://localhost:3001/projects/" + id);
            setProjects(projects.filter(project => project.id !== id));
        } catch (err) {
            console.log(err);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div>
            <h2>Projects</h2>
            <table className="projects-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map(project => (
                        <tr key={project.id}>
                            <td>{project.title}</td>
                            <td>{project.description}</td>
                            <td>{formatDate(project.start_date)}</td>
                            <td>{formatDate(project.end_date)}</td>
                            <td>{project.status}</td>
                            <td>
                                <button className="delete" onClick={() => handleDelete(project.id)}>Delete</button>
                                <Link to={`/update/${project.id}`} className="update">Update</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button>
                <Link to="/add">Add new project</Link>
            </button>
        </div>
    );
}

export default Projects;
