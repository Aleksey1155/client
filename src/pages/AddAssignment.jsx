import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddAssignment = () => {
    const [assignment, setAssignment] = useState({
        task_id:"",
        user_id:"",
        assigned_date:"",
    });

    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get("http://localhost:3001/users");
                setUsers(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchUsers();
    }, []);

    const handleChange = (e) =>{
        setAssignment(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClick = async e => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3001/assignments", assignment);
            navigate("/assignments");
        } catch (err) {
            console.log(err);
        }
    };

    console.log(assignment);

    return (
        <div className="form">
            <h1>Add new assignment</h1>
            <input type="number" placeholder="task_id" onChange={handleChange} name="task_id"/>
            <select name="user_id" onChange={handleChange} value={assignment.user_id}>
                <option value="">Select User</option>
                {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                ))}
            </select>
            <input type="date" placeholder="assigned_date" onChange={handleChange} name="assigned_date"/>
            <button className="nav-addlink" onClick={handleClick}>Add</button>
        </div>
    );
};

export default AddAssignment;
