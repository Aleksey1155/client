import React, { useEffect, useState, useContext } from "react";
import { useSocket } from "../../SocketContext"; // Імпортуємо ху
import { ThemeContext } from "../../ThemeContext";
import { useLocation } from "react-router-dom"; // Імпортуємо useLocation
import { Link, useNavigate } from "react-router-dom";
import "./navbarUser.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import axiosInstance from "../../../src/axiosInstance";

function NavbarUser({ userData }) {
  const socket = useSocket();
  const [unreadCount, setUnreadCount] = useState(0); // <-- число
  const location = useLocation(); // Отримуємо поточне розташування маршруту
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (socket && !socket.connected) {
      console.log("Сокет не підключений, чекаємо на підключення...");
      socket.connect(); // Якщо сокет не підключений, підключити його вручну
    }
  }, [socket]);

  useEffect(() => {
    if (socket?.connected && userData?.id) {
      console.log("Socket підключено, можна відправити події");
      socket.emit("someEvent", userData);
      socket.emit("joinRoom", userData.id);
      console.log("Приєднано до кімнати:", userData.id);
    } else {
      console.log("Socket не підключений, неможливо надіслати подію.");
    }
  }, [socket, userData]); // Залежність від сокета та userData

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
    if (socket) {
      socket.on("connect", () => {
        console.log("Socket підключено!");
        if (userData?.id) {
          socket.emit("joinRoom", userData.id); // Підключення до кімнати
          console.log("Приєднано до кімнати:", userData.id);
        }
      });

      socket.on("disconnect", () => {
        console.log("Socket відключено");
      });

      return () => {
        socket.off("connect");
        socket.off("disconnect");
      };
    }
  }, [socket, userData]);

  useEffect(() => {
    if (socket && userData?.id) {
      socket.on("message", (msg) => {
        console.log("Received message USER NAVBAR+++:", msg);
        // Перевірка формату даних
        if (!msg.receiverId) return;

        if (userData.id === msg.receiverId && !msg.isRead) {
          setUnreadCount((prev) => prev + 1);
        }
      });

      socket.on("messagesRead", ({ userId, unreadCountInChat }) => {
        if (userId === userData.id) {
          setUnreadCount((prev) => Math.max(prev - unreadCountInChat, 0));
        }
      });

      return () => {
        socket.off("message");
        socket.off("messagesRead");
      };
    }
  }, [socket, userData]);

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
  }, [userData, socket]);

  console.log("unreadCount+++++", unreadCount);

  return (
    <div className="navbar">
      
      <div className="wrapper">
        <div className="search">
          <input type="text" placeholder="Search..." />
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
          <Link to="/messenger">
          <div className="item">
            <NotificationsOutlinedIcon className="icon" />
            {unreadCount > 0 && <div className="counter">{unreadCount}</div>}
          </div>
          </Link>
          <Link to="/social">
            <div className="item">
              <ChatBubbleOutlineOutlinedIcon className="icon" />
              <div className="counter">2</div>
            </div>
          </Link>
          <div className="item">
            <ListOutlinedIcon className="icon" />
          </div>
          <div className="item">
            <img src={userData.img} alt="" className="avatar" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavbarUser;
