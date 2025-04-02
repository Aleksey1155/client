import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../../ThemeContext";
import "./sidebarAdmin.scss";
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
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import InterestsOutlinedIcon from "@mui/icons-material/InterestsOutlined";
import UserProfile from "../../../pages/userprofile/UserProfile";

function SidebarAdmin() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {}, [darkMode]);
  
  const navigate = useNavigate();

  const handleLogout = () => {
    // Очищення токена з локального сховища або сесії
    localStorage.removeItem("token");
    // Перенаправлення на сторінку входу
    navigate("/login");
  };

  return (
    <div className="sidebarAdmin">
      <div className="containerAdmin">
        <div className="topAdmin">
          <Link to="/admin">
            <span className="logoAdmin">AdminPanel</span>
          </Link>
        </div>
        <div className="center">
          <ul>
            <p className="title">MAIN</p>
            <Link to="/admin">
              <li>
                <HomeOutlinedIcon className="icon" />
                <span>Home</span>
              </li>
            </Link>
            <Link to="/admin/dashboard">
              <li>
                <DashboardIcon className="icon" />
                <span>Dashboard</span>
              </li>
            </Link>
            <Link to="/admin/social">
              <li>
                <InterestsOutlinedIcon className="icon" />
                <span>Social</span>
              </li>
            </Link>
            <p className="title">LIST</p>
            <Link to="/admin/users">
              <li>
                <PersonOutlineIcon className="icon" />
                <span>Users</span>
              </li>
            </Link>
            <Link to="/admin/projects">
              <li>
                <FolderSharedOutlinedIcon className="icon" />
                <span>Projects</span>
              </li>
            </Link>
            <Link to="/admin/tasks">
              <li>
                <AssignmentOutlinedIcon className="icon" />
                <span>Tasks</span>
              </li>
            </Link>
            <Link to="/admin/assignments">
              <li>
                <CheckBoxOutlinedIcon className="icon" />
                <span>Assignments</span>
              </li>
            </Link>
            <p className="title">USEFUL</p>
            <Link to="/admin/statistics">
              <li>
                <BarChartOutlinedIcon className="icon" />
                <span>Statistics</span>
              </li>
            </Link>
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
            <Link to="/admin/settings">
              <li>
                <SettingsOutlinedIcon className="icon" />
                <span>Settings</span>
              </li>
            </Link>
            <p className="title">USER</p>

            <li>
              <AccountBoxOutlinedIcon className="icon" />
              <UserProfile />
            </li>

            <li onClick={handleLogout}>
              <LogoutOutlinedIcon className="icon" />
              <span>Logout</span>
            </li>
          </ul>
        </div>
        <div className="bottomAdmin">
          {/* Вимкнення темного режиму */}
          <div className="colorOptionAdmin" onClick={() => toggleTheme(false)}></div>

          {/* Увімкнення темного режиму */}
          <div className="colorOptionAdmin dark" onClick={() => toggleTheme(true)}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default SidebarAdmin;
