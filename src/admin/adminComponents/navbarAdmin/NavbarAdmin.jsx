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
import axiosInstance from "../../../axiosInstance";
import io from "socket.io-client";

function NavbarAdmin({ userData }) {
  const socket = io("http://localhost:3001", {
    transports: ["websocket", "polling"],
    withCredentials: true,
  });
  const [unreadCount, setUnreadCount] = useState(0); // <-- число
  const location = useLocation(); // Отримуємо поточне розташування маршруту
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!userData?.id) return;

      try {
        const res = await axiosInstance.get(
          `/api/messages/unread/${userData.id}`
        );
        setUnreadCount(res.data.count);
      } catch (err) {
        console.error("Axios error:", err);
      }
    };

    fetchUnreadCount();
  }, [userData]);

  useEffect(() => {
    if (userData?.id) {
      socket.emit("joinRoom", userData.id);
      console.log("Joined socket room+++++++++:", userData.id);
    }
  }, [userData]);

  console.log("userData.id//////////", userData.id);
  useEffect(() => {
    if (!userData?.id) return;

    socket.on("message", (msg) => {
      console.log("Received message ADMIN NAVBAR:", msg.receiverId);

      // Ігноруємо груповий чат
      if (!msg.receiverId) return console.log("eeeeeeeee");

      // Перевіряємо, що повідомлення призначене цьому користувачу і ще не прочитане
      if (userData.id === msg.receiverId && !msg.isRead) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    return () => {
      socket.off("message");
    };
  }, [userData]);

  useEffect(() => {
    if (!userData?.id) return;
  
    socket.on("messagesRead", ({ chatId, userId }) => {
      console.log(`Отримано підтвердження, що користувач ${userId} прочитав чат ${chatId}`);
      
      // Якщо поточний користувач — той, хто прочитав → скидаємо лічильник
      if (userId === userData.id) {
        setUnreadCount(0);
      }
  
      // Якщо треба — оновити інтерфейс в інших (наприклад, якщо список чатів з лічильниками)
      // Тут можеш додати ще якусь логіку
    });
  
    return () => {
      socket.off("messagesRead");
    };
  }, [userData]);
  

  console.log("unreadCount+++++", unreadCount);

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
              {unreadCount > 0 && (
                <div className="counterNavbarAdmin">{unreadCount}</div>
              )}
            </div>

            <div className="itemNavbarAdmin">
              <ChatBubbleOutlineOutlinedIcon className="iconNavbarAdmin" />
              <div className="counterNavbarAdmin">2</div>
            </div>
            <div className="itemNavbarAdmin">
              <ListOutlinedIcon className="iconNavbarAdmin" />
            </div>
            <div className="itemNavbarAdmin">
              <img src={userData.img} alt="" className="avatarNavbarAdmin" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavbarAdmin;
