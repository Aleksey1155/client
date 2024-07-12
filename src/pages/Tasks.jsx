import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Tasks = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchAllTasks = async () => {
            try {
                const res = await axios.get("http://localhost:3001/tasks");
                setTasks(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchAllTasks();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete("http://localhost:3001/tasks/" + id);
            setTasks(tasks.filter(task => task.id !== id));
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
            <h2>Tasks</h2>
            <table className="projects-table">
                <thead>
                    <tr>
                        <th>Project Id</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task.id}>
                            <td>{task.project_id}</td>
                            <td>{task.title}</td>
                            <td>{task.description}</td>
                            <td>{formatDate(task.start_date)}</td>
                            <td>{formatDate(task.end_date)}</td>
                            <td>{task.priority}</td>
                            <td>{task.status}</td>
                            <td>
                                <button className="delete" onClick={() => handleDelete(task.id)}>Delete</button>
                                <Link to={`/update_task/${task.id}`} className="update">Update</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button  className="formButton">
                <Link to="/add_task">Add new task</Link>
            </button>
        </div>
    );
}

export default Tasks;