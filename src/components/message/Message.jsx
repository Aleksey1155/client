import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../../SocketContext";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../axiosInstance";
import io from "socket.io-client";
import "./message.scss";

function Message({ userData, selectedUser }) {
  const socket = useSocket();
  const { t } = useTranslation();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const lastMessageRef = useRef(null);
  const chatId = selectedUser
    ? [selectedUser.id, userData.id].sort().join("_")
    : null;

  

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
        const response = await axiosInstance.get("/api/messages");
        if (Array.isArray(response.data)) {
          // Фільтруємо тільки повідомлення поточного чату
          const chatMessages = response.data.filter(
            (msg) => msg.chatId === chatId
          );
          setMessages(chatMessages);
        } else {
          console.error("Expected an array but got:", response.data);
          setMessages([]);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      }
    }

    const markMessagesAsRead = async () => {
      if (!chatId || !userData?.id || !socket) return;

      try {
        await axiosInstance.put(`/api/messages/read/${chatId}/${userData.id}`);
      } catch (err) {
        console.error("Failed to mark messages as read", err);
      }
    };

    markMessagesAsRead();

    fetchMessages();
  }, [chatId, userData]);

  const handleSendMessage = async () => {
    try {
      const response = await axiosInstance.post("/api/messages", {
        userId: userData.id,
        receiverId: selectedUser.id,
        message: newMessage,
        userName: userData.name, // Додаємо ім'я користувача
        replyTo: replyTo,
        chatId: chatId,
      });
      console.log("response", response);

      if (!response.data || !response.data._id || !socket) {
        console.error("Error: Server did not return a valid message ID");
        return;
      }

      const savedMessage = {
        ...response.data,
        id: response.data._id, // Призначаємо id
      };
      console.log("savedMessage", savedMessage);
      // Відправляємо повідомлення через socket.io
      socket.emit("message", savedMessage);

      // Видаляємо локальне додавання, бо socket.on додасть це повідомлення!
      // setMessages((prevMessages) => [...prevMessages, savedMessage]);

      setNewMessage("");
      setReplyTo(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleEditMessage = async (messageId, newText) => {
    try {
      if (!messageId || !socket) {
        console.error("Error: Message ID is undefined");
        return;
      }
      await axiosInstance.put(`/api/messages/${messageId}`, {
        message: newText,
      });
    } catch (error) {
      console.error("Error editing message:", error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    console.log("Message list before delete:", messages);
    console.log("Deleting message with ID:", messageId);
    try {
      if (!messageId || !socket) {
        console.error("Error: Message ID is undefined");
        return;
      }
      await axiosInstance.delete(`/api/messages/${messageId}`);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const groupedMessages = groupMessagesByDate(messages);

  useEffect(() => {
    console.log("Message component socket:", socket);
  }, [socket]);

  useEffect(() => {
    socket.on("message", (msg) => {
      console.log("Received message:", msg);

      if (!msg._id || !socket) {
        console.error("Error: Received message has no ID");
        return;
      }

      // Фільтруємо тільки повідомлення поточного чату
      if (msg.chatId !== chatId) {
        return;
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
                ? { ...msg, replyTo: t("message.deleted") } // Позначаємо, що відповідь була видалена // Ключ: "message.deleted"
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
  }, [chatId, socket, t]);

  useEffect(() => {
    if (!chatId || !userData?.id || !socket) return;

    const markMessagesAsRead = async () => {
      try {
        await axiosInstance.put(`/api/messages/read/${chatId}/${userData.id}`);

        //  Тут  повідомляємо всіх через сокет
        socket.emit("markMessagesAsRead", {
          chatId,
          userId: userData.id,
        });
      } catch (err) {
        console.error("Failed to mark messages as read", err);
      }
    };

    markMessagesAsRead();
  }, [chatId, userData, socket]);

  if (!selectedUser) {
    return (
      <div className="noSelectedUser">
        <h2>{t("message.chooseConversation")}</h2> {/* Ключ: "message.chooseConversation" */}
      </div>
    );
  }

  return (
    <div className="messageHome">
      <div className="clientMessageHome">
        <img
          className="messageImgHome"
          src={selectedUser?.img} // Аватар
          alt=""
        />
        <div className="clientMessageNameHome">{selectedUser?.name}</div>
      </div>
      <div className="containerMessageHome">
        <div className="messageDataHome">
          {Object.keys(groupedMessages).map((date) => (
            <div key={date}>
              <div className="dateHeaderHome">{date}</div>

              {/* {console.log("All messages:", messages)} */}
              {groupedMessages[date].map((message, index) => (
                <div
                  className="blockGroupedMessages"
                  key={`${message.time || Date.now()}-${message.id || index}`}
                  ref={
                    index === groupedMessages[date].length - 1
                      ? lastMessageRef
                      : null
                  }
                >
                  {/* {console.log("Rendering message:", message)} */}

                  <div
                    className={
                      message.userId === userData.id
                        ? "messageItemHome own"
                        : "messageItemHome"
                    }
                  >
                    <div className="messageBoxHome">
                      <div className="messageTopHome">
                        {/* <span className="userName">{message.userName}</span> */}
                        <div className="messageTextHome">
                          {message.replyTo ? (
                            message.replyTo === t("message.deleted") ? ( // Ключ: "message.deleted"
                              <div className="replyTagHome">
                                | ↳ {t("message.messageDeleted")} {/* Ключ: "message.messageDeleted" */}
                              </div>
                            ) : typeof message.replyTo === "object" ? (
                              <div className="replyTagHome">
                                {/* */}
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      "| ↳ " +
                                      (message.replyTo.message.length > 40
                                        ? message.replyTo.message.slice(0, 40) +
                                          "..."
                                        : message.replyTo.message),
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="replyTagHome">
                                | ↳ {t("message.loadingReply")}... {/* Ключ: "message.loadingReply" */}
                              </div>
                            )
                          ) : null}
                          <div
                            dangerouslySetInnerHTML={{
                              __html: message.message,
                            }}
                          />
                        </div>
                      </div>

                      <div className="messageBottomHome">
                        <span className="msgData">
                          {formatTime(message.time)}
                        </span>

                        {message.userId === userData.id ? (
                          <div className="msgBtn">
                            <button
                              className="btnEdit"
                              onClick={() =>
                                handleEditMessage(
                                  message.id,
                                  prompt(t("message.editPrompt"), message.message) // Ключ: "message.editPrompt"
                                )
                              }
                            >
                              ✏️
                            </button>

                            <button
                              className="btnDelete"
                              onClick={() => handleDeleteMessage(message.id)}
                            >
                              🗑
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btnReply"
                            onClick={() => setReplyTo(message.id)}
                          >
                            💬
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* <div className="messageBottom">2 хв тому</div> */}
        {replyTo && (
          <p>
            {t("message.replyingTo")} "{/* Ключ: "message.replyingTo" */}
            {messages.find((msg) => msg.id === replyTo)?.message ||
              t("message.loading")} {/* Ключ: "message.loading" */}
            "
          </p>
        )}

        <div className="chatAddTextHome">
          <textarea
            className="chatTextAreaHome"
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button className="send-messageHome" onClick={handleSendMessage}>
            {t("message.send")} {/* Ключ: "message.send" */}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Message;