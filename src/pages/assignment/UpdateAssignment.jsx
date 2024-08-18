import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const UpdateAssignment = () => {
    const [assignment, setAssignment] = useState({
        task_id:"",
        user_id:"",
        assigned_date:"",
    });

    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const assignmentId = location.pathname.split("/")[2];

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
            await axios.put("http://localhost:3001/assignments/" + assignmentId, assignment);
            navigate("/assignments");
        } catch (err) {
            console.log(err);
        }
    };

    console.log(assignment);

    return (
        <div className="form">
            <h1>Редагування Призначення</h1>
            <input type="number" placeholder="номер завдання" onChange={handleChange} name="task_id"/>
            <select name="user_id" onChange={handleChange} value={assignment.user_id}>
                <option value="">Select User</option>
                {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                ))}
            </select>
            <input type="date" placeholder="assigned_date" onChange={handleChange} name="assigned_date"/>
            <button className="nav-addlink" onClick={handleClick}>Редагувати</button>
        </div>
    );
};

export default UpdateAssignment;
