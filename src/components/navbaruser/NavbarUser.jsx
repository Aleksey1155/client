import React, { useEffect, useState, useContext } from "react";
import { useSocket } from "../../SocketContext"; //
import { ThemeContext } from "../../ThemeContext";
import { useLocation } from "react-router-dom"; // Імпортуємо useLocation
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./navbarUser.scss";
import SearchBar from "../../components/searchBar/SearchBar";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import axiosInstance from "../../axiosInstance";

function NavbarUser({ userData }) {
  const { t, i18n } = useTranslation();
  const socket = useSocket();
  const [unreadCount, setUnreadCount] = useState(0); // <-- число
  const location = useLocation(); // Отримуємо поточне розташування маршруту
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  console.log("📣 Unread Counts in NavbarUser:", unreadCount);

  useEffect(() => {
    if (!socket) return;

    socket.onAny((event, ...args) => {
      console.log("📡 SOCKET EVENT:", event, args);
    });

    return () => {
      socket.offAny();
    };
  }, [socket]);

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

  // Слушаем notification!!!!!!!!!!!!!!!!!!!!!!!
  useEffect(() => {
    if (!userData?.id || !socket) return;

    socket.on("notification", (notif) => {
      console.log("Received notification USER NAVBAR +++:", notif);
      if (Array.isArray(notif)) {
        notif.forEach((n) => {
          if (n.receiverId === userData.id) {
            setUnreadCount((prev) => prev + 1);
          }
        });
      } else if (notif.receiverId === userData.id) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    return () => {
      socket.off("notification");
    };
  }, [userData, socket]);

  useEffect(() => {
    if (!userData?.id || !socket) return;

    socket.on("message", (msgs) => {
      console.log("Received message USER NAVBAR +++:", msgs);

      // Логування кожного повідомлення
      msgs.forEach((msg, index) => {
        console.log(`Message ${index}:`, msg);
      });

      const newUnread = msgs.filter(
        (msg) => msg.receiverId === userData.id && !msg.isRead
      ).length;

      if (newUnread > 0) {
        setUnreadCount((prev) => prev + newUnread);
      }
    });

    return () => {
      socket.off("message");
    };
  }, [userData, socket]);

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

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // console.log("unreadCount+++++", unreadCount)

  // Очищення пошукового тексту при зміні маршруту

  return (
    <div className="navbar">
      <div className="wrapper">
      <div className="search">
              {userData.name}
            </div>
        {t("welcome")}
        <div className="item">
          <div className="item">
            <LanguageOutlinedIcon className="icon" />
            <button className="button" onClick={() => changeLanguage("en")}>
              EN
            </button>
            <button className="button" onClick={() => changeLanguage("uk")}>
              UA
            </button>
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
          {/* <div className="item">
            <FullscreenExitOutlinedIcon className="icon" />
          </div> */}
          <Link to="/messenger">
            <div className="item">
              <NotificationsOutlinedIcon className="icon" />
              {unreadCount > 0 && <div className="counter">{unreadCount}</div>}
            </div>
          </Link>
          {/* <Link to="/social">
            <div className="item">
              <ChatBubbleOutlineOutlinedIcon className="icon" />
              <div className="counter">2</div>
            </div>
          </Link> */}
          {/* <div className="item">
            <ListOutlinedIcon className="icon" />
          </div> */}
          <div className="item">
            <img src={userData.img} alt="" className="avatar" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavbarUser;
