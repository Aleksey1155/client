import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

const UpdateTask = () => {
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
    const location = useLocation();
    const taskId = location.pathname.split("/")[2];

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/tasks/${taskId}`);
                const taskData = res.data;
                // Змініть формат дати для полів input type="date"
                taskData.start_date = new Date(taskData.start_date).toISOString().split('T')[0];
                taskData.end_date = new Date(taskData.end_date).toISOString().split('T')[0];
                setTask(taskData);
            } catch (err) {
                console.log(err);
            }
        };

        const fetchStatuses = async () => {
            try {
                const res = await axios.get("http://localhost:3001/task_statuses");
                setStatuses(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        const fetchPriorities = async () => {
            try {
                const res = await axios.get("http://localhost:3001/task_priorities");
                setPriorities(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchTask();
        fetchStatuses();
        fetchPriorities();
    }, [taskId]);

    const handleChange = (e) => {
        setTask((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleEditorChange = (content) => {
        setTask(prev => ({ ...prev, description: content }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3001/tasks/${taskId}`, task);
            navigate("/tasks");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="form">
            <h1>Update the Task</h1>
            <input type="number" placeholder="project_id" onChange={handleChange} name="project_id" value={task.project_id} />
            <input type="text" placeholder="title" onChange={handleChange} name="title" value={task.title} />
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
            <input type="date" placeholder="start_date" onChange={handleChange} name="start_date" value={task.start_date} />
            <input type="date" placeholder="end_date" onChange={handleChange} name="end_date" value={task.end_date} />
            <select name="priority_id" onChange={handleChange} value={task.priority_id}>
                {priorities.map((priority) => (
                    <option key={priority.id} value={priority.id}>
                        {priority.priority_name}
                    </option>
                ))}
            </select>
            <select name="status_id" 
            onChange={handleChange} 
            value={task.status_id}>
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

export default UpdateTask;
