import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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

    const handleEditorChange = (content) => {
        setProject(prev => ({ ...prev, description: content }));
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
            <h1>Додати новий проект</h1>
            <input type="text" placeholder="Назва нового проекту" onChange={handleChange} name="title" />
            <ReactQuill
                value={project.description}
                onChange={handleEditorChange}
                modules={{
                    toolbar: [
                        [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                        [{size: []}],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                        ['link', 'image'],
                        ['clean']
                    ],
                }}
                formats={[
                    'header', 'font', 'size',
                    'bold', 'italic', 'underline', 'strike', 'blockquote',
                    'list', 'bullet', 'indent',
                    'link', 'image'
                ]}
            />
            <input type="date" placeholder="start_date" onChange={handleChange} name="start_date" />
            <input type="date" placeholder="end_date" onChange={handleChange} name="end_date" />
            <select name="status_id" onChange={handleChange} value={project.status_id}>
                <option value="" disabled>Виберіть статус</option>
                {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                        {status.status_name}
                    </option>
                ))}
            </select>
            <button className="nav-addlink" onClick={handleClick}>Додати</button>
        </div>
    );
};

export default AddProject;
