import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import InterestsOutlinedIcon from '@mui/icons-material/InterestsOutlined';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Очищення токена з локального сховища або сесії
    localStorage.removeItem("token");

    // Перенаправлення на сторінку входу
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
