import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import FolderSharedOutlinedIcon from "@mui/icons-material/FolderSharedOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Очищення токена з локального сховища або сесії
    localStorage.removeItem("token");

    // Перенаправлення на сторінку входу
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="container">
        <div className="top">
          <Link to="/">
            <span className="logo">welcome.com</span>
          </Link>
        </div>
        <div className="center">
          <ul>
            <p className="title">MAIN</p>
            <Link to="/">
              <li>
                <DashboardIcon className="icon" />
                <span>Dashboard</span>
              </li>
            </Link>
            <p className="title">LIST</p>
            <Link to="/users">
              <li>
                <PersonOutlineIcon className="icon" />
                <span>Users</span>
              </li>
            </Link>
            <Link to="/projects">
              <li>
                <FolderSharedOutlinedIcon className="icon" />
                <span>Projects</span>
              </li>
            </Link>
            <Link to="/tasks">
              <li>
                <AssignmentOutlinedIcon className="icon" />
                <span>Tasks</span>
              </li>
            </Link>
            <Link to="/assignments">
              <li>
                <CheckBoxOutlinedIcon className="icon" />
                <span>Assignments</span>
              </li>
            </Link>
            <p className="title">USEFUL</p>
            <li>
              <BarChartOutlinedIcon className="icon" />
              <span>Statistics</span>
            </li>
            <li>
              <NotificationsNoneOutlinedIcon className="icon" />
              <span>Notification</span>
            </li>
            <li>
              <AttachMoneyOutlinedIcon className="icon" />
              <span>Finance</span>
            </li>
            <p className="title">SERVICE</p>
            <li>
              <ListOutlinedIcon className="icon" />
              <span>Logs</span>
            </li>
            <li>
              <SettingsOutlinedIcon className="icon" />
              <span>Settings</span>
            </li>
            <p className="title">USER</p>
            <li>
              <AccountBoxOutlinedIcon className="icon" />
              <span>Profile</span>
            </li>
            <li onClick={handleLogout}>
              <LogoutOutlinedIcon className="icon" />
              <span>Logout</span>
            </li>
          </ul>
        </div>
        <div className="bottom">
          <div className="colorOption"></div>
          <div className="colorOption"></div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
