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
  console.log("Conversation unreadCounts ++++++", unreadCounts);
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      if (!userData?.id) return;

      try {
        const res = await axiosInstance.get(
          `/api/messages/unread/${userData.id}`
        );
        // Очікуємо, що бекенд поверне масив [{ chatId: "abc", count: 3 }, ...]
        const counts = {};
        res.data.forEach(({ chatId, count }) => {
          counts[chatId] = count;
        });
        setUnreadCounts(counts);
      } catch (err) {
        console.error("Axios error:", err);
      }
    };

    fetchUnreadCounts();
  }, [userData]);

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
    onUserSelect(data); // тут ми ВИКЛИКАЄМО функцію з батька
    // console.log("Conversation", data);
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
                  const chatId =
                    conversation.chatId || `${userData.id}_${conversation.id}`; // або як ти формуєш chatId

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
