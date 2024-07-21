import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const TaskDetails = () => {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/tasks/${id}`);
                setTask(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        const fetchAllAssignments = async () => {
            try {
                const res = await axios.get("http://localhost:3001/assignments");
                // Filter assignments for this task
                setAssignments(res.data.filter(assignment => assignment.task_id === Number(id)));
            } catch (err) {
                console.log(err);
            }
        };

        const fetchUsers = async () => {
            try {
                const res = await axios.get("http://localhost:3001/users");
                setUsers(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchTask();
        fetchAllAssignments();
        fetchUsers();
    }, [id]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleDelete = async (assignmentId) => {
        const confirmed = window.confirm("Ви впевнені, що хочете видалити це призначення?");
        if (confirmed) {
            try {
                await axios.delete(`http://localhost:3001/assignments/${assignmentId}`);
                setAssignments(assignments.filter(assignment => assignment.id !== assignmentId));
            } catch (err) {
                console.log(err);
            }
        }
    };

    if (!task) {
        return <div>Loading...</div>;
    }

    return (
        <div className="details">
            <div className="nav-links">
                <Link to="/" className="nav-link">Головна</Link>
                <Link to="/projects" className="nav-link">Проекти</Link>
                <Link to="/tasks" className="nav-link">Завдання</Link>
                <Link to="/users" className="nav-link">Виконавці</Link>
                <Link to="/assignments" className="nav-link">Призначення</Link>
            </div>

            <h2>Task Details</h2>
            <div>
                <h3>{task.title}</h3>
                <div dangerouslySetInnerHTML={{ __html: task.description }} />
                <Link to={`/update_task/${task.id}`} className="nav-addlink">Редагувати завдання</Link>
                <p>Start Date: {formatDate(task.start_date)}</p>
                <p>End Date: {formatDate(task.end_date)}</p>
                <p>Status: {task.status_name}</p>
                <p>Priority: {task.priority_name}</p>
                <p>Номер завдання: {task.id}</p>
                <Link to="/add_assignment" className="nav-addlink">Додати виконавця</Link>
            </div>
            <h2>Виконавці завдання</h2>
            <table className="projects-table">
                <thead>
                    <tr>
                        <th>Task Id</th>
                        <th>User Name</th>
                        <th>Assigned Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {assignments.map(assignment => {
                        const user = users.find(user => user.id === assignment.user_id);
                        return (
                            <tr key={assignment.id}>
                                <td>{assignment.task_id}</td>
                                <td>{user ? user.name : "Unknown"}</td>
                                <td>{formatDate(assignment.assigned_date)}</td>
                                <td>
                                    <button className="delete" onClick={() => handleDelete(assignment.id)}>Delete</button>
                                    <Link to={`/update_assignment/${assignment.id}`} className="update">Update</Link>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default TaskDetails;
