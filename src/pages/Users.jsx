import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Users = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const res = await axios.get("https://backend-ecqm.onrender.com/users");
                setUsers(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchAllUsers();
    }, []);

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Ви впевнені, що хочете видалити цей проект?");
        if (confirmed) {
            try {
                await axios.delete("https://backend-ecqm.onrender.com/users/" + id);
                setUsers(users.filter(user => user.id !== id));
            } catch (err) {
                console.log(err);
            }
        }
    };


    return (
        <div>
            <div className="nav-links">
                <Link to="/" className="nav-link">Головна</Link>
                <Link to="/projects" className="nav-link">Проекти</Link>
                <Link to="/tasks" className="nav-link">Завдання</Link>
                <Link to="/assignments" className="nav-link">Призначення</Link>
            </div>
            <h2>Виконавці</h2>
            <table className="projects-table">
                <thead>
                    <tr>
                        <th>ID Виконавця</th>
                        <th>ПІБ Виконавця</th>
                        <th>Email</th>
                        <th>Телефон</th>
                        <th>Посада</th>
                        <th>Дії</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.role_name}</td>
                            <td>
                                <button className="delete" onClick={() => handleDelete(user.id)}>Видалити</button>
                                <Link to={`/update_user/${user.id}`} className="update">Редагувати</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br />
            <Link to="/add_user" className="nav-addlink">Додати нового виконавця</Link>
        </div>
    );
}

export default Users;
