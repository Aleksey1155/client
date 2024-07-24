import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const ProjectDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [taskStatuses, setTaskStatuses] = useState([]);
    const [taskPriorities, setTaskPriorities] = useState([]);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/projects/${id}`);
                setProject(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchProject();
    }, [id]);

    useEffect(() => {
        const fetchAllTasks = async () => {
            try {
                const res = await axios.get("http://localhost:3001/tasks");
                setTasks(res.data.filter(task => task.project_id === Number(id)));
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
    }, [id]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const truncateDescription = (description, maxLength) => {
        if (description.length > maxLength) {
            return description.substring(0, maxLength) + '...';
        }
        return description;
    };

    const handleDelete = async (taskId) => {
        const confirmed = window.confirm("Ви впевнені, що хочете видалити це завдання?");
        if (confirmed) {
            try {
                await axios.delete(`http://localhost:3001/tasks/${taskId}`);
                setTasks(tasks.filter(task => task.id !== taskId));
            } catch (err) {
                console.log(err);
            }
        }
    };

    if (!project) {
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

            <h2>Деталі Проекта</h2>
            <div>
                <h3>{project.title}</h3>
                <div dangerouslySetInnerHTML={{ __html: project.description }} />
                <p>Дата початку проекту : {formatDate(project.start_date)}</p>
                <p>Дата закінчення проекту: {formatDate(project.end_date)}</p>
                <p>Статус проекту: {project.status_name}</p>
                <Link to={`/update_project/${project.id}`} className="nav-addlink">Редагувати проект</Link>
            </div>
            <h2>Завдання для проекту </h2>
            <table className="projects-table">
                <thead>
                    <tr>
                        <th>Ноиер проекту</th>
                        <th>Назва завдання</th>
                        <th>Опис завдання</th>
                        <th>Дата початку</th>
                        <th>Дата закінчення</th>
                        <th>Приоритет завдання</th>
                        <th>Статус завдання</th>
                        <th>Дії</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task.id}>
                            <td><Link to={`/project/${task.project_id}`}>
                                {task.project_id}
                            </Link></td>
                            <td><Link to={`/task/${task.id}`}>
                                {task.title}
                            </Link></td>
                            <td dangerouslySetInnerHTML={{ __html: truncateDescription(task.description, 500) }}></td>
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
        </div>
    );
};

export default ProjectDetails;
