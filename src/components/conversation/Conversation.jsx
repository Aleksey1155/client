import React, { useEffect, useState, useContext } from "react";
import "./conversation.scss";
import axiosInstance from "../../../src/axiosInstance";
import io from "socket.io-client";

function Conversation({ users, userData, onUserSelect }) {
  const socket = io("http://localhost:3001", {
    transports: ["websocket", "polling"],
    withCredentials: true,
  });
  const conversations = users;
  const [unreadCounts, setUnreadCounts] = useState({});

  // console.log("users???????????", users);
  // console.log("userData???????????", userData);
  // console.log("Conversation unreadCounts ++++++", unreadCounts);

  useEffect(() => {
    const fetchUnreadCounts = async () => {
      if (!userData?.id) return;

      try {
        const res = await axiosInstance.get(
          `/api/messages/unread-by-chat/${userData.id}`
        );

        // console.log("Response from unread-by-chat API:", res.data);

        const counts = {};
        res.data.forEach(({ _id, count }) => {
          counts[_id] = count;
        });
        setUnreadCounts(counts);
      } catch (err) {
        console.error("Axios error:", err);
      }
    };

    fetchUnreadCounts();
  }, [userData]); // Залежність від userData, щоб повторно запитувати при зміні userData

  useEffect(() => {
    if (!userData?.id) return;

    socket.on("message", (msg) => {
      console.log("Received message conversations======:", msg.receiverId);

      if (!msg.receiverId) return;

      if (msg.receiverId === userData.id && !msg.isRead) {
        setUnreadCounts((prev) => ({
          ...prev,
          [msg.chatId]: (prev[msg.chatId] || 0) + 1,
        }));
      }
    });

    return () => {
      socket.off("message");
    };
  }, [userData]);

  const handleClick = (data) => {
    const chatId = [userData.id, data.id].sort().join("_");

    const unreadCountInChat = unreadCounts[chatId] || 0;

    console.log("SEND chatId:", chatId, "Unread:", unreadCountInChat);

    // Emit подія: повідомлення прочитано + передай скільки саме
    socket.emit("messagesRead", {
      chatId,
      userId: userData.id,
      unreadCountInChat: unreadCountInChat, // <-- виправили назву
    });

    // Обнуляємо лічильник по цьому чату
    setUnreadCounts((prev) => ({
      ...prev,
      [chatId]: 0,
    }));

    // Вибір користувача
    onUserSelect(data);
  };

  return (
    <div className="conversation">
      <div className="containerConversation">
        <div className="conversationList">
          <div>
            <div>
              {conversations
                .filter((conversation) => conversation.id !== userData.id)
                .map((conversation) => {
                  const chatId = [userData.id, conversation.id]
                    .sort()
                    .join("_");

                  return (
                    <div key={conversation.id}>
                      <div
                        className="conversationItem"
                        onClick={() => handleClick(conversation)}
                      >
                        <img
                          className="conversationImg"
                          src={conversation.img}
                          alt=""
                        />
                        <p className="conversationName">{conversation.name}</p>
                        {/* {console.log("unreadCounts:", unreadCounts)}
                        {console.log("chatId in loop:", chatId)} */}

                        {unreadCounts[chatId] > 0 && (
                          <div className="conversationCounter">
                            {unreadCounts[chatId]}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Conversation;
