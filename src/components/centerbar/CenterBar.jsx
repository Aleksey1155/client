import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Stories from "../stories/Stories";
import Posts from "../posts/Posts";
import axios from "axios";
import "./centerBar.scss";

function CenterBar() {
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
    <div className="centerBar">
      <div className="container">
        <Stories userId = {userData.id} />
        <Posts />
      </div>
      <div className="user">
        <p> Welcome, {userData.name}!</p>
        <p>
          Email: {userData.email} ID: {userData.id}
        </p>
        {/* Додаткова інформація про користувача */}
      </div>
    </div>
  );
}

export default CenterBar;
