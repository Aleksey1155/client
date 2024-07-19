import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Tasks = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchAllTasks = async () => {
            try {
                const res = await axios.get("http://localhost:3001/tasks");
                console.log(res.data); // Додайте це для перевірки структури даних
                setTasks(sortTasks(res.data));
            } catch (err) {
                console.log(err);
            }
        };

        fetchAllTasks();
    }, []);

    const sortTasks = (tasks) => {
        return tasks.sort((a, b) => {
            if (a.project_id !== b.project_id) {
                return a.project_id - b.project_id;
            }
            if (a.id !== b.id) {
                return a.id - b.id;
            }
            if (a.priority_name !== b.priority_name) {
                return a.priority_name.localeCompare(b.priority_name);
            }
            if (a.status_name !== b.status_name) {
                return a.status_name.localeCompare(b.status_name);
            }
            return new Date(a.start_date) - new Date(b.start_date);
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Ви впевнені, що хочете видалити цей проект?");
        if (confirmed) {
            try {
                await axios.delete("http://localhost:3001/tasks/" + id);
                setTasks(sortTasks(tasks.filter(task => task.id !== id)));
            } catch (err) {
                console.log(err);
            }
        }
    };

    
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div>
            <div className="nav-links">
                <Link to="/" className="nav-link">Головна</Link>
                <Link to="/projects" className="nav-link">Проекти</Link>
                <Link to="/users" className="nav-link">Виконавці</Link>
                <Link to="/assignments" className="nav-link">Призначення</Link>
            </div>
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
                    {Array.isArray(tasks) && tasks.map(task => (
                        <tr key={task.id}>
                            <td>{task.project_id}</td>
                            <td> {task.title}<br /><br /><br />ID завдання {task.id}  </td>
                            <td>{task.description}</td>
                            <td>{formatDate(task.start_date)}</td>
                            <td>{formatDate(task.end_date)}</td>
                            <td>{task.priority_name}</td>
                            <td>{task.status_name}</td>
                            <td>
                                <button className="delete" onClick={() => handleDelete(task.id)}>Delete</button>
                                <Link to={`/update_task/${task.id}`} className="update">Update</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br />
            <Link to="/add_task" className="nav-addlink">Add new task</Link>
        </div>
    );
}

export default Tasks;
