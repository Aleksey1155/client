import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const UpdateUser = () => {
    const [user, setUser] = useState({
        email: "",
        name: "",
        phone: "",
        role_id: "",
    });

    const [roles, setRoles] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();
    const userId = location.pathname.split("/")[2];

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await axios.get("https://backend-ecqm.onrender.com/roles");
                setRoles(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        const fetchUser = async () => {
            try {
                const res = await axios.get(`https://backend-ecqm.onrender.com/users/${userId}`);
                setUser(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchRoles();
        fetchUser();
    }, [userId]);

    const handleChange = (e) => {
        setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await axios.put("https://backend-ecqm.onrender.com/users/" + userId, user);
            navigate("/users");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="form">
            <h1>Редагувати Виконавця</h1>
            <input type="text" placeholder="name" onChange={handleChange} name="name" value={user.name} />
            <input type="text" placeholder="email" onChange={handleChange} name="email" value={user.email} />
            <input type="text" placeholder="phone" onChange={handleChange} name="phone" value={user.phone} />
            <select name="role_id" onChange={handleChange} value={user.role_id}>
                <option value="" disabled>Select role</option>
                {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                        {role.name}
                    </option>
                ))}
            </select>
            <button className="nav-addlink" onClick={handleClick}>Редагувати</button>
        </div>
    );
};

export default UpdateUser;
