import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../../../ThemeContext";
import { useLocation } from "react-router-dom"; // Імпортуємо useLocation
import "./navbarAdmin.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";

function NavbarAdmin({userData}) {
  const location = useLocation(); // Отримуємо поточне розташування маршруту
  const { darkMode, toggleTheme } = useContext(ThemeContext);


  // Очищення пошукового тексту при зміні маршруту

  return (
    <div className="navbarAdmin">
      <div className="containerNavbarAdmin">
        <div className="wrapperNavbarAdmin">
          <div className="searchNavbarAdmin">
            <input type="text" placeholder="Search..." />
            <SearchOutlinedIcon />
          </div>
          <div className="itemsNavbarAdmin">
            <div className="itemNavbarAdmin">
              <LanguageOutlinedIcon className="iconNavbarAdmin" />
              English
            </div>
            <div
              className="itemNavbarAdmin"
              onClick={toggleTheme}
              style={{ cursor: "pointer" }}
            >
              {darkMode ? (
                <LightModeOutlinedIcon className="iconNavbarAdmin" />
              ) : (
                <DarkModeOutlinedIcon className="iconNavbarAdmin" />
              )}
            </div>

            <div className="itemNavbarAdmin">
              <FullscreenExitOutlinedIcon className="iconNavbarAdmin" />
            </div>
            <div className="itemNavbarAdmin">
              <NotificationsOutlinedIcon className="iconNavbarAdmin" />
              <div className="counterNavbarAdmin">1</div>
            </div>
            <div className="itemNavbarAdmin">
              <ChatBubbleOutlineOutlinedIcon className="iconNavbarAdmin" />
              <div className="counterNavbarAdmin">2</div>
            </div>
            <div className="itemNavbarAdmin">
              <ListOutlinedIcon className="iconNavbarAdmin" />
            </div>
            <div className="itemNavbarAdmin">
              <img
                src={userData.img}
                alt=""
                className="avatarNavbarAdmin"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavbarAdmin;
