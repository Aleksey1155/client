import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


const IndexPage = () => {
    const [dashboardData, setDashboardData] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await axios.get("http://localhost:3001/dashboard");
                setDashboardData(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchDashboardData();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div>
            <div className="nav-links">
                <Link to="/projects" className="nav-link">Проекти</Link>
                <Link to="/tasks" className="nav-link">Завдання</Link>
                <Link to="/users" className="nav-link">Виконавці</Link>
                <Link to="/assignments" className="nav-link">Призначення</Link>
            </div>

            <h2>Таблиця призначень</h2>
            <table className="dashboard-table">
                <thead>
                    <tr>
                        <th>Task Title</th>
                        <th>Project Title</th>
                        <th>User Name</th>
                        <th>Assigned Date</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Task Status</th>
                        <th>Project Status</th>
                    </tr>
                </thead>
                <tbody>
                    {dashboardData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.task_title}</td>
                            <td>{item.project_title}</td>
                            <td>{item.user_name}</td>
                            <td>{formatDate(item.assigned_date)}</td>
                            <td>{formatDate(item.start_date)}</td>
                            <td>{formatDate(item.end_date)}</td>
                            <td>{item.task_status}</td>
                            <td>{item.project_status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default IndexPage;
