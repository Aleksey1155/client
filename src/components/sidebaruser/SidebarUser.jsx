import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../ThemeContext";
import { useTranslation } from "react-i18next";
import "./sidebarUser.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import InterestsOutlinedIcon from "@mui/icons-material/InterestsOutlined";
import UserProfile from "../../pages/userprofile/UserProfile";

function SidebarUser() {
  const { t, i18n } = useTranslation();
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
          <p className="title">{t("main")}</p>
            <Link to="/">
              <li>
                <DashboardIcon className="icon" />
                <span>{t("dashboard")}</span>
              </li>
            </Link>
            <Link to="/social">
              <li>
                <InterestsOutlinedIcon className="icon" />
                <span>{t("social")}</span>
              </li>
            </Link>
           

            <p className="title">{t("useful")}</p>
            <li>
              <NotificationsNoneOutlinedIcon className="icon" />
              <span>Notification</span>
            </li>
            <p className="title">{t("user")}</p>
            <li>
              <AccountBoxOutlinedIcon className="icon" />
              <UserProfile />
            </li>
            <li onClick={handleLogout}>
              <LogoutOutlinedIcon className="icon" />
              <span>{t("logout")}</span>
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

export default SidebarUser;
