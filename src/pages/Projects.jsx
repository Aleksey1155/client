import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const fetchAllProjects = async () => {
            try {
                const res = await axios.get("https://backend-ecqm.onrender.com/projects");
                setProjects(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchAllProjects();
    }, []);

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Ви впевнені, що хочете видалити цей проект?");
        if (confirmed) {
            try {
                await axios.delete("https://backend-ecqm.onrender.com/projects/" + id);
                setProjects(projects.filter(project => project.id !== id));
            } catch (err) {
                console.log(err);
            }
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const filteredProjects = projects.filter(project => {
        return (
            (!selectedStatus || project.status_name === selectedStatus) &&
            project.title.toLowerCase().includes(searchText.toLowerCase())
        );
    });

    const truncateDescription = (description, maxLength) => {
        if (description.length > maxLength) {
            return description.substring(0, maxLength) + '...';
        }
        return description;
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Пошук..."
                className="search"
                value={searchText}
                onChange={handleSearchChange}
            />
            <div className="nav-links">
                <Link to="/" className="nav-link">Головна</Link>
                <Link to="/tasks" className="nav-link">Завдання</Link>
                <Link to="/users" className="nav-link">Виконавці</Link>
                <Link to="/assignments" className="nav-link">Призначення</Link>
            </div>

            <h2>Проекти</h2>

            <select name="status-select" onChange={handleStatusChange} value={selectedStatus}>
                <option value="">Виберіть статус</option>
                {Array.from(new Set(projects.map(project => project.status_name))).map(status => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>

            <table className="projects-table">
                <thead>
                    <tr>
                        <th>Номер Проекту</th>
                        <th>Назва Проекту</th>
                        <th>Опис Проекту</th>
                        <th>Дата Початку</th>
                        <th>Дата Закінчення</th>
                        <th>Статус Проекту</th>
                        <th>Дії</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(filteredProjects) && filteredProjects.map(project => (
                        <tr key={project.id}>
                            <td>{project.id}</td>
                            <td>
                                <Link to={`/project/${project.id}`}>
                                    {project.title}
                                </Link>
                            </td>
                            <td dangerouslySetInnerHTML={{ __html: truncateDescription(project.description, 500) }}></td>
                            <td>{formatDate(project.start_date)}</td>
                            <td>{formatDate(project.end_date)}</td>
                            <td>{project.status_name}</td>
                            <td>
                                <button className="delete" onClick={() => handleDelete(project.id)}>Видалити</button>
                                <Link to={`/update_project/${project.id}`} className="update">Редагувати</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br />
            <Link to="/add_project" className="nav-addlink">Додати новий проект</Link>
        </div>
    );
};

export default Projects;
