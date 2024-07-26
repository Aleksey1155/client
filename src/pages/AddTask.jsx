import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddTask = () => {
    const [task, setTask] = useState({
        project_id: "",
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        priority_id: "",
        status_id: "",
    });

    const [statuses, setStatuses] = useState([]);
    const [priorities, setPriorities] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchStatusesAndPriorities = async () => {
            try {
                const statusRes = await axios.get("https://backend-ecqm.onrender.com/task_statuses");
                setStatuses(statusRes.data);

                const priorityRes = await axios.get("https://backend-ecqm.onrender.com/task_priorities");
                setPriorities(priorityRes.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchStatusesAndPriorities();
    }, []);

    const handleChange = (e) => {
        setTask((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleEditorChange = (value) => {
        setTask((prev) => ({ ...prev, description: value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await axios.post("https://backend-ecqm.onrender.com/tasks", task);
            navigate("/tasks");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="form">
            <h1>Додати нове завдання</h1>
            <input type="number" placeholder="id проекту" onChange={handleChange} name="project_id" />
            <input type="text" placeholder="Назва нового завдання" onChange={handleChange} name="title" />
            <ReactQuill
                value={task.description}
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
            <select name="priority_id" onChange={handleChange} value={task.priority_id}>
                <option value="" disabled>Виберіть приоритет</option>
                {priorities.map((priority) => (
                    <option key={priority.id} value={priority.id}>
                        {priority.priority_name}
                    </option>
                ))}
            </select>
            <select name="status_id" onChange={handleChange} value={task.status_id}>
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

export default AddTask;
