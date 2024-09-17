import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./settings.scss";

function Settings() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [addnews, setAddnews] = useState({
    user_id: "",
    news_text: "",
  });

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
        // Оновлюємо addnews після завантаження userData
        setAddnews((prev) => ({
          ...prev,
          user_id: response.data.id,
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  console.log(userData);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>Дані користувача відсутні.</div>;
  }

  const handleChange = (e) => {
    setAddnews((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (!addnews.news_text.trim()) {
      alert("Поле новин не може бути порожнім!");
      return;
    }
    try {
      await axios.post("http://localhost:3001/news", addnews);
      // Очищення поля після успішного додавання новини
    setAddnews({ news_text: "" });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="settings">
      <div className="containerSennings">
        <h1>Settings Page</h1>

        <form onSubmit={(e) => e.preventDefault()}>
          <textarea
            type="text"
            placeholder="News text"
            onChange={handleChange}
            name="news_text"
            value={addnews.news_text} // Додаємо значення поля
          />
          <button className="addNews" onClick={handleClick}>
            Add News
          </button>
        </form>
        <div className="user">
          <p>Welcome, {userData.name}!</p>
          <p>ID: {userData.id}</p>
          <p>
            Email: {userData.email} 
          </p>
          <p>User Role: {userData.role_name}</p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
