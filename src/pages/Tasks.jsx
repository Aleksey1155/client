import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [taskStatuses, setTaskStatuses] = useState([]);
    const [taskPriorities, setTaskPriorities] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedPriority, setSelectedPriority] = useState('');

    useEffect(() => {
        const fetchAllTasks = async () => {
            try {
                const res = await axios.get("http://localhost:3001/tasks");
                console.log(res.data);
                setTasks(sortTasks(res.data));
            } catch (err) {
                console.log(err);
            }
        };

        const fetchTaskStatuses = async () => {
            try {
                const res = await axios.get("http://localhost:3001/task_statuses");
                setTaskStatuses(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        const fetchTaskPriorities = async () => {
            try {
                const res = await axios.get("http://localhost:3001/task_priorities");
                setTaskPriorities(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchAllTasks();
        fetchTaskStatuses();
        fetchTaskPriorities();
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

    const filteredTasks = tasks.filter(task => {
        const statusMatch = selectedStatus ? task.status_name === selectedStatus : true;
        const priorityMatch = selectedPriority ? task.priority_name === selectedPriority : true;
        return statusMatch && priorityMatch;
    });
    const truncateDescription = (description, maxLength) => {
        if (description.length > maxLength) {
            return description.substring(0, maxLength) + '...';
        }
        return description;
    };


    return (
        <div>
            <div className="nav-links">
                <Link to="/" className="nav-link">Головна</Link>
                <Link to="/projects" className="nav-link">Проекти</Link>
                <Link to="/users" className="nav-link">Виконавці</Link>
                <Link to="/assignments" className="nav-link">Призначення</Link>
            </div>
            <h2>Завдання</h2>
            <div className="filter-select">
                <p>Фільтр за статусом &emsp;</p>
                <select name="task-status" onChange={(e) => setSelectedStatus(e.target.value)} value={selectedStatus}>
                    <option value="">Всі</option>
                    {taskStatuses.map(status => (
                        <option key={status.id} value={status.status_name}>{status.status_name}</option>
                    ))}
                </select> &emsp;

                <p>Фільтр за пріоритетом &ensp;</p>
                <select name="task-priority" onChange={(e) => setSelectedPriority(e.target.value)} value={selectedPriority}>
                    <option value="">Всі</option>
                    {taskPriorities.map(priority => (
                        <option key={priority.id} value={priority.priority_name}>{priority.priority_name}</option>
                    ))}
                </select>
            </div>
            <table className="projects-table">
                <thead>
                    <tr>
                        <th>Номер Проекту</th>
                        <th>Назва Завдання</th>
                        <th>Опис Завдання</th>
                        <th>Дата Початку</th>
                        <th>Дата Закінчення</th>
                        <th>Приоритет Завдання</th>
                        <th>Статус Завдання</th>
                        <th>Дії</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(filteredTasks) && filteredTasks.map(task => (
                        <tr key={task.id}>
                            <td><Link to={`/project/${task.project_id}`}>
                                    {task.project_id}
                                </Link></td>
                            <td> <Link to={`/task/${task.id}`}>
                                    {task.title}
                                </Link>  </td>
                            <td dangerouslySetInnerHTML={{ __html: truncateDescription(task.description, 500) }}></td>
                            <td>{formatDate(task.start_date)}</td>
                            <td>{formatDate(task.end_date)}</td>
                            <td>{task.priority_name}</td>
                            <td>{task.status_name}</td>
                            <td>
                                <button className="delete" onClick={() => handleDelete(task.id)}>Видалити</button>
                                <Link to={`/update_task/${task.id}`} className="update">Редагувати</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br />
            <Link to="/add_task" className="nav-addlink">Додати нове завдання</Link>
        </div>
    );
}

export default Tasks;
