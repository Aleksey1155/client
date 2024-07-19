import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddUser = () => {
    const [user, setUser] = useState({
        email: "",
        name: "",
        phone: "",
        role_id: "",
    });

    const [roles, setRoles] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await axios.get("http://localhost:3001/roles");
                setRoles(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchRoles();
    }, []);

    const handleChange = (e) => {
        setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3001/users", user);
            navigate("/users");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="form">
            <h1>Add new user</h1>
            <input type="text" placeholder="name" onChange={handleChange} name="name" />
            <input type="text" placeholder="email" onChange={handleChange} name="email" />
            <input type="text" placeholder="phone" onChange={handleChange} name="phone" />
            <select name="role_id" onChange={handleChange} value={user.role_id}>
                <option value="" disabled>Select role</option>
                {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                        {role.name}
                    </option>
                ))}
            </select>
            <button className="nav-addlink" onClick={handleClick}>Add</button>
        </div>
    );
};

export default AddUser;
