import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
                const statusRes = await axios.get("http://localhost:3001/task_statuses");
                setStatuses(statusRes.data);

                const priorityRes = await axios.get("http://localhost:3001/task_priorities");
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

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3001/tasks", task);
            navigate("/tasks");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="form">
            <h1>Add new task</h1>
            <input type="number" placeholder="project_id" onChange={handleChange} name="project_id" />
            <input type="text" placeholder="title" onChange={handleChange} name="title" />
            <textarea placeholder="description" onChange={handleChange} name="description" />
            <input type="date" placeholder="start_date" onChange={handleChange} name="start_date" />
            <input type="date" placeholder="end_date" onChange={handleChange} name="end_date" />
            <select name="priority_id" onChange={handleChange} value={task.priority_id}>
                <option value="" disabled>Select priority</option>
                {priorities.map((priority) => (
                    <option key={priority.id} value={priority.id}>
                        {priority.priority_name}
                    </option>
                ))}
            </select>
            <select name="status_id" onChange={handleChange} value={task.status_id}>
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

export default AddTask;
