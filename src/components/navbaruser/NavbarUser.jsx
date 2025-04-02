import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../../ThemeContext";
import { useLocation } from "react-router-dom";  // Імпортуємо useLocation
import "./navbarUser.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";

function NavbarUser({userData}) {
 const { darkMode, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();  // Отримуємо поточне розташування маршруту

  // Очищення пошукового тексту при зміні маршруту
  

 
  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          <input
            type="text"
            placeholder="Search..."
           
          />
          <SearchOutlinedIcon />
        </div>
        <div className="item">
          <div className="item">
            <LanguageOutlinedIcon className="icon" />
            English
          </div>
          <div
              className="item"
              onClick={toggleTheme}
              style={{ cursor: "pointer" }}
            >
              {darkMode ? (
                <LightModeOutlinedIcon className="icon" />
              ) : (
                <DarkModeOutlinedIcon className="icon" />
              )}
            </div>
          <div className="item">
            <FullscreenExitOutlinedIcon className="icon" />
          </div>
          <div className="item">
            <NotificationsOutlinedIcon className="icon" />
            <div className="counter">1</div>
          </div>
          <div className="item">
            <ChatBubbleOutlineOutlinedIcon className="icon" />
            <div className="counter">2</div>
          </div>
          <div className="item">
            <ListOutlinedIcon className="icon" />
          </div>
          <div className="item">
            <img
              src={userData.img}
              alt=""
              className="avatar"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavbarUser;
