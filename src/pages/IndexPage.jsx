import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const IndexPage = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [taskStatus, setTaskStatus] = useState('');
  const [projectStatus, setProjectStatus] = useState('');
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [taskStatuses, setTaskStatuses] = useState([]);
  const [projectStatuses, setProjectStatuses] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get("http://localhost:3001/dashboard");
        setDashboardData(res.data);
        setFilteredData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3001/users");
        console.log("Users Data:", res.data);
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchTaskStatuses = async () => {
      try {
        const res = await axios.get("http://localhost:3001/task_statuses");
        console.log("Task Statuses Data:", res.data);
        setTaskStatuses(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchProjectStatuses = async () => {
      try {
        const res = await axios.get("http://localhost:3001/project_statuses");
        console.log("Project Statuses Data:", res.data);
        setProjectStatuses(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDashboardData();
    fetchUsers();
    fetchTaskStatuses();
    fetchProjectStatuses();
  }, []);

  useEffect(() => {
    filterData();
  }, [taskStatus, projectStatus, userId]);

  const filterData = () => {
    let filtered = dashboardData;

    if (taskStatus) {
      filtered = filtered.filter(item => item.task_status === taskStatus);
    }

    if (projectStatus) {
      filtered = filtered.filter(item => item.project_status === projectStatus);
    }

    if (userId) {
      filtered = filtered.filter(item => item.user_id === parseInt(userId));
    }

    setFilteredData(filtered);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <Link to="/graphs" className="graphs-link">
      <img src="/src/assets/graphs.png" alt="Іконка графіків" />
      Графіки
    </Link>
      <div className="nav-links">
      
        <Link to="/projects" className="nav-link">Проекти</Link>
        <Link to="/tasks" className="nav-link">Завдання</Link>
        <Link to="/users" className="nav-link">Виконавці</Link>
        <Link to="/assignments" className="nav-link">Призначення</Link>
      </div>
      <div className="nav-addlinks">
        <h3>Додати проект</h3>
        <Link to="/add_project" className="nav-addlink">Add new project</Link>
      </div>

      <h2>Таблиця завдань та призначень</h2>
      <div className="filter-select">
        <p>Фільтр статус завдання &emsp;</p>
        <select name="task-status" onChange={(e) => setTaskStatus(e.target.value)} value={taskStatus}>
          <option value="">Всі</option>
          {taskStatuses.map(status => (
            <option key={status.id} value={status.status_name}>{status.status_name}</option>
          ))}
        </select> &emsp;
        <p>Фільтр статус проекта &ensp;</p>
        <select name="project-status" onChange={(e) => setProjectStatus(e.target.value)} value={projectStatus}>
          <option value="">Всі</option>
          {projectStatuses.map(status => (
            <option key={status.id} value={status.status_name}>{status.status_name}</option>
          ))}
        </select> &emsp;
        <p>Фільтр по виконавцям &ensp;</p>
        <select name="user-select" onChange={(e) => setUserId(e.target.value)} value={userId}>
          <option value="">Всі</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>
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
          {Array.isArray(filteredData) && filteredData.map((item, index) => (
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
