import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../ThemeContext";
import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import InterestsOutlinedIcon from "@mui/icons-material/InterestsOutlined";
import UserProfile from "../../pages/userprofile/UserProfile";

function Sidebar() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {}, [darkMode]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="sidebarUser">
      <div className="containerUser">
        <div className="topUser">
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
            <Link to="/social">
              <li>
                <InterestsOutlinedIcon className="icon" />
                <span>Social</span>
              </li>
            </Link>
            <p className="title">LIST</p>

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
              <SettingsOutlinedIcon className="icon" />
              <span>Settings</span>
            </li>
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
        <div className="bottomSidebarUser">
          {/* Вимкнення темного режиму */}
          <div className="colorOptionSidebarUser" onClick={() => toggleTheme(false)}></div>

          {/* Увімкнення темного режиму */}
          <div
            className="colorOptionSidebarUser dark"
            onClick={() => toggleTheme(true)}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
