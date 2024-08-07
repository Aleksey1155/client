import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Assignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");

    useEffect(() => {
        const fetchAllAssignments = async () => {
            try {
                const res = await axios.get("https://backend-ecqm.onrender.com/assignments");
                setAssignments(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        const fetchUsers = async () => {
            try {
                const res = await axios.get("https://backend-ecqm.onrender.com/users");
                setUsers(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchAllAssignments();
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Ви впевнені, що хочете видалити цей проект?");
        if (confirmed) {
            try {
                await axios.delete("https://backend-ecqm.onrender.com/assignments/" + id);
                setAssignments(assignments.filter(assignment => assignment.id !== id));
            } catch (err) {
                console.log(err);
            }
        }
    };

    const handleFilterChange = (e) => {
        setSelectedUser(e.target.value);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const filteredAssignments = selectedUser
        ? assignments.filter(assignment => assignment.user_id === parseInt(selectedUser))
        : assignments;

    return (
        <div>

            <div className="nav-links">
                <Link to="/" className="nav-link">Головна</Link>
                <Link to="/projects" className="nav-link">Проекти</Link>
                <Link to="/tasks" className="nav-link">Завдання</Link>
                <Link to="/users" className="nav-link">Виконавці</Link>
            </div>
            <h2>Призначення</h2>
            <select name="filtr-select" onChange={handleFilterChange} value={selectedUser}>
                    <option value="">Всі виконавці</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>
            <table className="projects-table">
                <thead>
                    <tr>
                        <th>Номер Завдання</th>
                        <th>ПІБ виконавця</th>
                        <th>Дата призначення</th>
                        <th>Дії</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAssignments.map(assignment => (
                        <tr key={assignment.id}>
                            <td>{assignment.task_id}</td>
                            <td>{assignment.user_name}</td>
                            <td>{formatDate(assignment.assigned_date)}</td>
                            <td>
                                <button className="delete" onClick={() => handleDelete(assignment.id)}>Видалити</button>
                                <Link to={`/update_assignment/${assignment.id}`} className="update">Редагувати</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br />
            <Link to="/add_assignment" className="nav-addlink">Додати нове призначення</Link>
        </div>
    );
}

export default Assignments;
