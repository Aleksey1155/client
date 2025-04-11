import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../../SocketContext";

import "./generalChat.scss";
import axiosInstance from "../../../src/axiosInstance";

function GeneralChat({ userData }) {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const lastMessageRef = useRef(null);
  // console.log("User DATA General Chat", userData);
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
          console.error("Expected an array but got:", response.data);
          setMessages([]);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      }
    }

    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    try {
      const response = await axiosInstance.post("/api/messages", {
        userId: userData.id,
        message: newMessage,
        userName: userData.name, // Додаємо ім'я користувача
        replyTo: replyTo,
        chatId: "general_chat",
      });
      console.log("response", response);

      if (!response.data || !response.data._id) {
        console.error("Error: Server did not return a valid message ID");
        return;
      }

      const savedMessage = {
        ...response.data,
        id: response.data._id, // Призначаємо id
      };

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
      if (!messageId) {
        console.error("Error: Message ID is undefined");
        return;
      }
      await axiosInstance.put(`/api/general-messages/${messageId}`, {
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
      if (!messageId) {
        console.error("Error: Message ID is undefined");
        return;
      }
      await axiosInstance.delete(`/api/general-messages/${messageId}`);
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
    socket.on("message", (msg) => {
      console.log("Received message:", msg);

      if (!msg._id) {
        console.error("Error: Received message has no ID");
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
                ? { ...msg, replyTo: "Deleted" } // Позначаємо, що відповідь була видалена
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
  }, []);

  return (
    <div className="rightBar">
      <div className="containerRightBar">
        <div className="chatName">Our General Chat</div>
        {Object.keys(groupedMessages).map((date) => (
          <div key={date}>
            <div className="dateHeader">{date}</div>

            {console.log("All messages:", messages)}
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
                {console.log("Rendering message:", message)}

                <span className="userName">{message.userName}</span>
                <div className="message">
                  {message.replyTo ? (
                    message.replyTo === "Deleted" ? (
                      <div className="replyTag">| ↳ Message deleted</div>
                    ) : typeof message.replyTo === "object" ? (
                      <div className="replyTag">
                        | ↳ {message.replyTo.message}
                      </div>
                    ) : (
                      <div className="replyTag">| ↳ Loading reply...</div>
                    )
                  ) : null}

                  {message.message}
                </div>

                <div className="msg-bottom">
                  <span className="msg-data">{formatTime(message.time)}</span>
                  {console.log("message.userId" , message.userId, "userData.id",userData.id) }
                  {message.userId === userData.id ? (
                    <div className="msg-btn">
                      <button
                        className="btn-edit"
                        onClick={() =>
                          handleEditMessage(
                            message.id,
                            prompt("Edit:", message.message)
                          )
                        }
                      >
                        ✏️ Edit
                      </button>
                      {/* {console.log(
                        "Trying to delete message with ID:",
                        message.id
                      )} */}
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteMessage(message.id)}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn-reply"
                      onClick={() => setReplyTo(message.id)}
                    >
                      💬 Reply
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}

        {replyTo && (
          <p>
            Replying to message: "
            {messages.find((msg) => msg.id === replyTo)?.message ||
              "Loading..."}
            "
          </p>
        )}

        <div className="chatAddText">
          <textarea
            className="chatTextArea"
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button className="send-message" onClick={handleSendMessage}>
            Send
          </button>
        </div>
        <p> Welcome, {userData.name}!</p>
      </div>
    </div>
  );
}

export default GeneralChat;
