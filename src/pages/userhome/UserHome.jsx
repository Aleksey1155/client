import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./userHome.scss";
import Stories from "../../components/stories/Stories";
import Posts from "../../components/posts/Posts";
import RightBar from "../../components/rightbar/RightBar";

function UserHome() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Додано стан завантаження
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:3001/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // Можна відобразити спіннер або повідомлення про завантаження
  }

  if (!userData) {
    return <div>No user data available.</div>; // Повідомлення, якщо дані користувача відсутні
  }
  return (
    <div className="userHome">
      
      <div className="container">
        <Stories userId = {userData.id} />
        <Posts />
     
      <div className="user">
        <p> Welcome, {userData.name}!</p>
        <p>
          Email: {userData.email} ID: {userData.id}
        </p>
        {/* Додаткова інформація про користувача */}
      </div>
      </div>
        <RightBar />
      </div>
    
 
  );
}

export default UserHome;
