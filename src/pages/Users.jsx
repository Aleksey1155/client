import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Users = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const res = await axios.get("http://localhost:3001/users");
                setUsers(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchAllUsers();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete("http://localhost:3001/users/" + id);
            setUsers(users.filter(user => user.id !== id));
        } catch (err) {
            console.log(err);
        }
    };

    // const formatDate = (dateString) => {
    //     const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    //     return new Date(dateString).toLocaleDateString(undefined, options);
    // };

    return (
        <div>
            <h2>Users</h2>
            <table className="projects-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>
                                <button className="delete" onClick={() => handleDelete(user.id)}>Delete</button>
                                <Link to={`/update_user/${user.id}`} className="update">Update</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button  className="formButton">
                <Link to="/add_user">Add new user</Link>
            </button>
        </div>
    );
}

export default Users;
