import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const IndexPage = () => {
  // Змінні стану для зберігання даних, отриманих з API та фільтрів
  const [dashboardData, setDashboardData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [taskStatus, setTaskStatus] = useState('');
  const [projectStatus, setProjectStatus] = useState('');
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [taskStatuses, setTaskStatuses] = useState([]);
  const [projectStatuses, setProjectStatuses] = useState([]);

  // Виконується при першому рендері для отримання даних з API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get("https://backend-ecqm.onrender.com/dashboard");
        setDashboardData(res.data);
        setFilteredData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    // Отримання даних про користувачів
    const fetchUsers = async () => {
      try {
        const res = await axios.get("https://backend-ecqm.onrender.com/users");
        console.log("Users Data:", res.data);
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    // Отримання даних про статуси завдань
    const fetchTaskStatuses = async () => {
      try {
        const res = await axios.get("https://backend-ecqm.onrender.com/task_statuses");
        console.log("Task Statuses Data:", res.data);
        setTaskStatuses(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    // Отримання даних про статуси проектів
    const fetchProjectStatuses = async () => {
      try {
        const res = await axios.get("https://backend-ecqm.onrender.com/project_statuses");
        console.log("Project Statuses Data:", res.data);
        setProjectStatuses(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    // Викликаємо функції для отримання даних
    fetchDashboardData();
    fetchUsers();
    fetchTaskStatuses();
    fetchProjectStatuses();
  }, []);

  // Виконується при зміні фільтрів
  useEffect(() => {
    filterData();
  }, [taskStatus, projectStatus, userId]);

  // Функція для фільтрації даних відповідно до вибраних фільтрів
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

  // Функція для форматування дати
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      {/* Посилання на сторінку з графіками */}
      <Link to="/graphs" className="graphs-link">
        <img src="/src/assets/graphs.png" alt="Іконка графіків" />
        Графіки
      </Link>
      
      {/* Навігаційні посилання */}
      <div className="nav-links">
        <Link to="/projects" className="nav-link">Проекти</Link>
        <Link to="/tasks" className="nav-link">Завдання</Link>
        <Link to="/users" className="nav-link">Виконавці</Link>
        <Link to="/assignments" className="nav-link">Призначення</Link>
      </div>
      
      {/* Посилання для додавання проекту */}
      <div className="nav-addlinks">
        <h3>Додати проект</h3>
        <Link to="/add_project" className="nav-addlink">Додати новий проект</Link>
      </div>

      <h2>Таблиця завдань та призначень</h2>

      {/* Фільтри для таблиці */}
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

      {/* Таблиця з даними */}
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Назва Завдання</th>
            <th>Назва проекту</th>
            <th>ПІБ Виконавця</th>
            <th>Дата Призначення</th>
            <th>Початок Завдання</th>
            <th>Кінець Завдання</th>
            <th>Статус Завдання</th>
            <th>Статус Проекту</th>
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
