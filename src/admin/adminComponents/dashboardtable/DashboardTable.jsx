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
import { useTranslation } from "react-i18next";

const DashboardTable = () => {
  const { t } = useTranslation();

  const [dashboardData, setDashboardData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [taskStatus, setTaskStatus] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [taskStatuses, setTaskStatuses] = useState([]);
  const [projectStatuses, setProjectStatuses] = useState([]);

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

    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchTaskStatuses = async () => {
      try {
        const res = await axiosInstance.get("/task_statuses");
        setTaskStatuses(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchProjectStatuses = async () => {
      try {
        const res = await axiosInstance.get("/project_statuses");
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

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isCloseToEnd = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= 2 && diffDays >= 0;
  };

  const isEndDatePassedAndInProgress = (endDate, taskStatus) => {
    const today = new Date();
    const end = new Date(endDate);
    return end < today && taskStatus === t("status.inProgress");
  };

  return (
    <div className="dashboardTable">
      <div className="dashboardContainer">
        <div className="top">
          <div className="addlinks">
            <p className="titleAdd">{t("addProject")}</p>
            <Link to="/admin/add_project" className="addlink">
              {t("addNewProject")}
            </Link>
          </div>
          <div className="tableTitle">{t("tableTitle")}</div>

          <div className="filtersSelect">
            <div className="selectTask">
              <p className="titleSelect">{t("taskStatusFilter")}</p>
              <select
                className="select"
                onChange={(e) => setTaskStatus(e.target.value)}
                value={taskStatus}
              >
                <option value="">{t("all")}</option>
                {taskStatuses.map((status) => (
                  <option key={status.id} value={status.status_name}>
                    {status.status_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="selectProject">
              <p className="titleSelect">{t("projectStatusFilter")}</p>
              <select
                className="select"
                onChange={(e) => setProjectStatus(e.target.value)}
                value={projectStatus}
              >
                <option value="">{t("all")}</option>
                {projectStatuses.map((status) => (
                  <option key={status.id} value={status.status_name}>
                    {status.status_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="selectUser">
              <p className="titleSelect">{t("userFilter")}</p>
              <select
                className="select"
                onChange={(e) => setUserId(e.target.value)}
                value={userId}
              >
                <option value="">{t("all")}</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <TableContainer component={Paper} className="table">
          <Table sx={{ minWidth: 650 }} aria-label="dashboard table">
            <TableHead>
              <TableRow>
                <TableCell className="tableCell">{t("taskTitle")}</TableCell>
                <TableCell className="tableCell">{t("projectTitle")}</TableCell>
                <TableCell className="tableCell">{t("executor")}</TableCell>
                <TableCell className="tableCell">{t("assignedDate")}</TableCell>
                <TableCell className="tableCell">{t("startDate")}</TableCell>
                <TableCell className="tableCell">{t("endDate")}</TableCell>
                <TableCell className="tableCell">{t("taskStatus")}</TableCell>
                <TableCell className="tableCell">{t("projectStatus")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="tableCell">{row.task_title}</TableCell>
                  <TableCell className="tableCell">{row.project_title}</TableCell>
                  <TableCell className="tableCell">{row.user_name}</TableCell>
                  <TableCell className="tableCell">{formatDate(row.assigned_date)}</TableCell>
                  <TableCell className="tableCell">{formatDate(row.start_date)}</TableCell>
                  <TableCell className="tableCell">
                    <span
                      className={`enddate ${
                        isCloseToEnd(row.end_date)
                          ? "closeToEnd"
                          : isEndDatePassedAndInProgress(row.end_date, row.task_status)
                          ? "endPassedInProgress"
                          : ""
                      }`}
                    >
                      {formatDate(row.end_date)}
                    </span>
                  </TableCell>
                  <TableCell className="tableCell">
                    <span className={`status ${row.task_status}`}>{row.task_status}</span>
                  </TableCell>
                  <TableCell className="tableCell">{row.project_status}</TableCell>
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
