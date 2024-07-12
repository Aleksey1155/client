import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Assignments = () => {
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        const fetchAllAssignments = async () => {
            try {
                const res = await axios.get("http://localhost:3001/assignments");
                setAssignments(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchAllAssignments();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete("http://localhost:3001/assignments/" + id);
            setAssignments(assignments.filter(assignment => assignment.id !== id));
        } catch (err) {
            console.log(err);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div>
            <h2>Assignments</h2>
            <table className="projects-table">
                <thead>
                    <tr>
                        <th>Task Id</th>
                        <th>User Id</th>
                        <th>Start Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {assignments.map(assignment => (
                        <tr key={assignment.id}>
                            <td>{assignment.task_id}</td>
                            <td>{assignment.user_id}</td>
                            <td>{formatDate(assignment.assigned_date)}</td>
                            
                            <td>
                                <button className="delete" onClick={() => handleDelete(assignment.id)}>Delete</button>
                                <Link to={`/update_assignment/${assignment.id}`} className="update">Update</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button  className="formButton">
                <Link to="/add_assignment">Add new assignment</Link>
            </button>
        </div>
    );
}

export default Assignments;
