import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../../SocketContext";
import { useTranslation } from "react-i18next";
import "./generalChat.scss";
import axiosInstance from "../../../src/axiosInstance";

function GeneralChat({ userData }) {
  const { t } = useTranslation();
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const lastMessageRef = useRef(null);

  // Функція для форматування дати
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Функція для форматування часу
  const formatTime = (timestamp) => {
    const time = new Date(timestamp);
    return time.toLocaleString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Групуємо повідомлення за датами
  const groupMessagesByDate = (messages) => {
    return messages.reduce((groups, message) => {
      const date = formatDate(message.time);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});
  };

  useEffect(() => {
    async function fetchMessages() {
      try {
        const response = await axiosInstance.get("/api/general-messages");

        if (Array.isArray(response.data)) {
          const generalMessages = response.data.filter(
            (msg) => msg.chatId === "general_chat"
          );
          setMessages(generalMessages);
        } else {
          console.error(t("generalChat.errorFetchingArray"), response.data); // Ключ: "generalChat.errorFetchingArray"
          setMessages([]);
        }
      } catch (error) {
        console.error(t("generalChat.errorFetching"), error); // Ключ: "generalChat.errorFetching"
        setMessages([]);
      }
    }

    fetchMessages();
  }, [t]);

  const handleSendMessage = async () => {
    try {
      const response = await axiosInstance.post("/api/messages", {
        userId: userData.id,
        message: newMessage,
        userName: userData.name, // Додаємо ім'я користувача
        replyTo: replyTo,
        chatId: "general_chat",
      });

      if (!response.data || !response.data._id) {
        console.error(t("generalChat.errorInvalidId")); // Ключ: "generalChat.errorInvalidId"
        return;
      }

      const savedMessage = {
        ...response.data,
        id: response.data._id, // Призначаємо id
      };

      // Відправляємо повідомлення через socket.io
      socket.emit("message", savedMessage);

      setNewMessage("");
      setReplyTo(null);
    } catch (error) {
      console.error(t("generalChat.errorSending"), error); // Ключ: "generalChat.errorSending"
    }
  };

  const handleEditMessage = async (messageId, newText) => {
    try {
      if (!messageId) {
        console.error(t("generalChat.errorUndefinedId")); // Ключ: "generalChat.errorUndefinedId"
        return;
      }
      await axiosInstance.put(`/api/general-messages/${messageId}`, {
        message: newText,
      });
    } catch (error) {
      console.error(t("generalChat.errorEditing"), error); // Ключ: "generalChat.errorEditing"
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      if (!messageId) {
        console.error(t("generalChat.errorUndefinedId")); // Ключ: "generalChat.errorUndefinedId"
        return;
      }
      await axiosInstance.delete(`/api/general-messages/${messageId}`);
    } catch (error) {
      console.error(t("generalChat.errorDeleting"), error); // Ключ: "generalChat.errorDeleting"
    }
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const groupedMessages = groupMessagesByDate(messages);

  useEffect(() => {
    socket.on("message", (msg) => {
      if (!msg._id) {
        console.error(t("generalChat.errorNoId")); // Ключ: "generalChat.errorNoId"
        return;
      }

      //  Перевіряємо, чи це повідомлення з general_chat
      if (msg.chatId !== "general_chat") {
        return; // ігноруємо, якщо це не той чат
      }

      setMessages((prevMessages) => {
        // Знаходимо повідомлення, на яке йде відповідь
        const repliedMessage = prevMessages.find((m) => m.id === msg.replyTo);

        return [
          ...prevMessages,
          {
            ...msg,
            id: msg._id,
            userName: msg.userName,
            time: msg.time || new Date().toISOString(),
            replyTo: repliedMessage ? repliedMessage : msg.replyTo, // Підтягуємо об'єкт повідомлення
          },
        ];
      });
    });

    socket.on("message_updated", (updatedMessage) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === updatedMessage._id
            ? { ...msg, ...updatedMessage, id: updatedMessage._id }
            : msg
        )
      );
    });

    socket.on("message_deleted", (messageId) => {
      setMessages(
        (prevMessages) =>
          prevMessages
            .map((msg) =>
              msg.replyTo && msg.replyTo.id === messageId
                ? { ...msg, replyTo: t("generalChat.deleted") } // Позначаємо, що відповідь була видалена // Ключ: "generalChat.deleted"
                : msg
            )
            .filter((msg) => msg.id !== messageId) // Видаляємо саме повідомлення
      );
    });

    return () => {
      socket.off("message");
      socket.off("message_updated");
      socket.off("message_deleted");
    };
  }, [socket, t]);

  return (
    <div className="rightBar">
      <div className="containerRightBar">
        <div className="chatName">{t("generalChat.chatName")}</div> {/* Ключ: "generalChat.chatName" */}
        {Object.keys(groupedMessages).map((date) => (
          <div key={date}>
            <div className="dateHeader">{date}</div>

            {groupedMessages[date].map((message, index) => (
              <div
                className="blockMessage"
                key={`${message.time || Date.now()}-${message.id || index}`}
                ref={
                  index === groupedMessages[date].length - 1
                    ? lastMessageRef
                    : null
                }
              >
                <span className="userName">{message.userName}</span>
                <div className="message">
                  {message.replyTo ? (
                    message.replyTo === t("generalChat.deleted") ? ( // Ключ: "generalChat.deleted"
                      <div className="replyTag">
                        | ↳ {t("generalChat.messageDeleted")}
                      </div>
                    ) : typeof message.replyTo === "object" ? (
                      <div className="replyTag">
                        | ↳ {message.replyTo.message}
                      </div>
                    ) : (
                      <div className="replyTag">
                        | ↳ {t("generalChat.loadingReply")}
                      </div>
                    )
                  ) : null}
                  {message.message}
                </div>

                <div className="msg-bottom">
                  <span className="msg-data">{formatTime(message.time)}</span>
                  {message.userId === userData.id ? (
                    <div className="msg-btn">
                      <button
                        className="btn-edit"
                        onClick={() =>
                          handleEditMessage(
                            message.id,
                            prompt(t("generalChat.editPrompt"), message.message) // Ключ: "generalChat.editPrompt"
                          )
                        }
                      >
                        ✏️ {t("generalChat.edit")} {/* Ключ: "generalChat.edit" */}
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteMessage(message.id)}
                      >
                        🗑 {t("generalChat.delete")} {/* Ключ: "generalChat.delete" */}
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn-reply"
                      onClick={() => setReplyTo(message.id)}
                    >
                      💬 {t("generalChat.reply")} {/* Ключ: "generalChat.reply" */}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}

        {replyTo && (
          <p>
            {t("generalChat.replyingTo")} "{/* Ключ: "generalChat.replyingTo" */}
            {messages.find((msg) => msg.id === replyTo)?.message ||
              t("generalChat.loading")} {/* Ключ: "generalChat.loading" */}
            "
          </p>
        )}

        <div className="chatAddText">
          <textarea
            className="chatTextArea"
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={t("generalChat.writeMessage")} // Ключ: "generalChat.writeMessage"
          />
          <button className="send-message" onClick={handleSendMessage}>
            {t("generalChat.send")} {/* Ключ: "generalChat.send" */}
          </button>
        </div>
        <p>
          {t("generalChat.welcome")}
          {userData.name}!
        </p>
      </div>
    </div>
  );
}

export default GeneralChat;