import React, { useState, useEffect,  useRef  } from "react";
import axiosInstance from "../../axiosInstance";
import "./generalChat.scss";

function GeneralChat({ userData }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyTo, setReplyTo] = useState(null); // Для відповіді
  

  useEffect(() => {
    async function fetchMessages() {
      try {
        const response = await axiosInstance.get("/api/messages");
        if (Array.isArray(response.data)) {
          setMessages(response.data);
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
      await axiosInstance.post("/api/messages", {
        userId: userData.id,
        message: newMessage,
        replyTo: replyTo,
      });

      setNewMessage("");
      setReplyTo(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleEditMessage = async (messageId, newText) => {
    try {
      await axiosInstance.put(`/api/messages/${messageId}`, {
        message: newText,
      });
    } catch (error) {
      console.error("Error editing message:", error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await axiosInstance.delete(`/api/messages/${messageId}`);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };


  const lastMessageRef = useRef(null);

useEffect(() => {
  if (lastMessageRef.current) {
    lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [messages]);

  
  
  

  return (
    <div className="rightBar" > 
      <div className="container">
        <div className="chatName">Our General Chat</div>
        {messages.map((message, index) => (
           <div className="blockMessage" key={message.id} ref={index === messages.length - 1 ? lastMessageRef : null}>
            <span className="userName">{message.name}</span>
            <div className="message">
              {message.replyTo && message.replyTo.message && (
                <div className="replyTag">| ↳ {message.replyTo.message}</div>
              )}
              {message.message}
            </div>
            <div className="msg-bottom">
              <span className="msg-data">{message.time}</span>

              {message.userId === userData.id ? (
                <>
                  <div className="msg-btn">
                    <button
                      onClick={() =>
                        handleEditMessage(
                          message.id,
                          prompt("Edit:", message.message)
                        )
                      }
                    >
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDeleteMessage(message.id)}>
                      🗑 Delete
                    </button>
                  </div>
                </>
              ) : (
                <button onClick={() => setReplyTo(message.id)}>💬 Reply</button>
              )}
            </div>
          </div>
        ))}

        {replyTo && <p>Replying to message {replyTo}</p>}

        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
        <p> Welcome, {userData.name}!</p>
      </div>
    </div>
  );
}

export default GeneralChat;
