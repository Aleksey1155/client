import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInstance";
import { Link } from "react-router-dom";
import "./dashboardtable.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const DashboardTable = () => {
  // Змінні стану для зберігання даних, отриманих з API та фільтрів
  const [dashboardData, setDashboardData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [taskStatus, setTaskStatus] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [taskStatuses, setTaskStatuses] = useState([]);
  const [projectStatuses, setProjectStatuses] = useState([]);

  // Виконується при першому рендері для отримання даних з API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axiosInstance.get("/dashboard");
        setDashboardData(res.data);
        setFilteredData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    // Отримання даних про користувачів
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/users");
        // console.log("Users Data:", res.data);
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    // Отримання даних про статуси завдань
    const fetchTaskStatuses = async () => {
      try {
        const res = await axiosInstance.get("/task_statuses");
        // console.log("Task Statuses Data:", res.data);
        setTaskStatuses(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    // Отримання даних про статуси проектів
    const fetchProjectStatuses = async () => {
      try {
        const res = await axiosInstance.get("/project_statuses");
        // console.log("Project Statuses Data:", res.data);
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
      filtered = filtered.filter((item) => item.task_status === taskStatus);
    }

    if (projectStatus) {
      filtered = filtered.filter(
        (item) => item.project_status === projectStatus
      );
    }

    if (userId) {
      filtered = filtered.filter((item) => item.user_id === parseInt(userId));
    }

    setFilteredData(filtered);
  };

  // Функція для форматування дати
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Функція для перевірки, чи є дата кінця завдання близькою до поточної дати (2 дні)
  const isCloseToEnd = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= 2 && diffDays >= 0;
  };

  // Функція для перевірки, чи дата закінчилась і статус "Виконується"
  const isEndDatePassedAndInProgress = (endDate, taskStatus) => {
    const today = new Date();
    const end = new Date(endDate);

    // Перевірка, чи дата закінчилась і статус завдання "Виконується"
    return end < today && taskStatus === "Виконується";
  };

  return (
    <div className="dashboardTable">
      <div className="dashboardContainer">
        <div className="top">
      {/* Посилання для додавання проекту */}
      <div className="addlinks">
        <p className="titleAdd">Додати проект</p>
        <Link to="/admin/add_project" className="addlink">
          Додати новий проект
        </Link>
      </div>
      <div className="tableTitle">Таблиця завдань та призначень</div>

      {/* Фільтри для таблиці */}
      <div className="filtersSelect">
        <div className="selectTask">
          <p className="titleSelect">Фільтр статус завдання</p>
          <select
            name="select"
            onChange={(e) => setTaskStatus(e.target.value)}
            value={taskStatus}
          >
            <option value="">Всі</option>
            {taskStatuses.map((status) => (
              <option key={status.id} value={status.status_name}>
                {status.status_name}
              </option>
            ))}
          </select>
        </div>
        <div className="selectProject">
          <p className="titleSelect">Фільтр статус проекта</p>
          <select
      
            name="select"
            onChange={(e) => setProjectStatus(e.target.value)}
            value={projectStatus}
          >
            <option  value="">Всі</option>
            {projectStatuses.map((status) => (
              <option key={status.id} value={status.status_name}>
                {status.status_name}
              </option>
            ))}
          </select>
        </div>
        <div className="selectUser">
          <p className="titleSelect">Фільтр по виконавцям </p>
          <select
            name="select"
            onChange={(e) => setUserId(e.target.value)}
            value={userId}
          >
            <option value="">Всі</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      </div>
      {/* Таблиця з даними */}

      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="tableCell">Назва Завдання</TableCell>
              <TableCell className="tableCell">Назва проекту</TableCell>
              <TableCell className="tableCell">ПІБ Виконавця</TableCell>
              <TableCell className="tableCell">Дата Призначення</TableCell>
              <TableCell className="tableCell">Початок Завдання</TableCell>
              <TableCell className="tableCell">Кінець Завдання</TableCell>
              <TableCell className="tableCell">Статус Завдання</TableCell>
              <TableCell className="tableCell">Статус Проекту</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="tableCell">{row.task_title}</TableCell>
                <TableCell className="tableCell">
                  {" "}
                  {row.project_title}{" "}
                </TableCell>
                <TableCell className="tableCell">{row.user_name}</TableCell>
                <TableCell className="tableCell">
                  {formatDate(row.assigned_date)}
                </TableCell>
                <TableCell className="tableCell">
                  {formatDate(row.start_date)}
                </TableCell>
                <TableCell className="tableCell">
                  <span
                    className={`enddate ${
                      isCloseToEnd(row.end_date)
                        ? "closeToEnd"
                        : isEndDatePassedAndInProgress(
                            row.end_date,
                            row.task_status
                          )
                        ? "endPassedInProgress"
                        : ""
                    }`}
                  >
                    {formatDate(row.end_date)}
                  </span>
                </TableCell>

                <TableCell className="tableCell">
                  <span className={`status ${row.task_status}`}>
                    {row.task_status}
                  </span>
                </TableCell>
                <TableCell className="tableCell">
                  {row.project_status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </div>
    </div>
  );
};

export default DashboardTable;
