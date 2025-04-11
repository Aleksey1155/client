import React, { useEffect, useState, useContext } from "react";
import { useSocket } from "../../../SocketContext"; //
import { ThemeContext } from "../../../ThemeContext";
import { useLocation } from "react-router-dom"; // Імпортуємо useLocation
import { Link, useNavigate } from "react-router-dom";
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

function NavbarAdmin({ userData }) {
  const socket = useSocket();
  const [unreadCount, setUnreadCount] = useState(0); // <-- число
  const location = useLocation(); // Отримуємо поточне розташування маршруту
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (socket && userData) {
      // Check if the socket is not null before emitting an event
      socket.emit("someEvent", userData);
    }
  }, [socket, userData]);

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
    if (userData?.id && socket) {
      socket.emit("joinRoom", userData.id);
      // console.log("Joined socket room:++++++", userData.id);
    }
  }, [userData]);

  // console.log("userData.id////", userData.id );

  useEffect(() => {
    if (!userData?.id || !socket) return;

    socket.on("message", (msg) => {
      console.log("Received message USER NAVBAR +++:", msg.receiverId);

      // Ігноруємо груповий чат
      if (!msg.receiverId) return;

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
    if (!userData?.id || !socket) return;

    socket.on("messagesRead", ({ userId, unreadCountInChat }) => {
      console.log(
        "Unread USER NAVBAR---:",
        unreadCountInChat,
        "userId",
        userId
      );
      if (userId === userData.id) {
        setUnreadCount((prev) => Math.max(prev - unreadCountInChat, 0));
      }
    });

    return () => {
      socket.off("messagesRead");
    };
  }, [userData]);

  // console.log("unreadCount+++++", unreadCount)

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
            <Link to="/admin/messenger">
              <div className="itemNavbarAdmin">
                <NotificationsOutlinedIcon className="iconNavbarAdmin" />
                {unreadCount > 0 && (
                  <div className="counterNavbarAdmin">{unreadCount}</div>
                )}
              </div>
            </Link>

            <Link to="/admin/social">
              <div className="itemNavbarAdmin">
                <ChatBubbleOutlineOutlinedIcon className="iconNavbarAdmin" />
                <div className="counterNavbarAdmin">2</div>
              </div>
            </Link>
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
