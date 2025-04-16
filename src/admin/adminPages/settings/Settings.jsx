import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../../axiosInstance";
import "./settings.scss";

function Settings() {
  const { t } = useTranslation();
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

        const response = await axiosInstance.get("/me", {
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
        console.error(t("settings.fetchUserDataError"), error); // Ключ: "settings.fetchUserDataError"
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, t]);

  const handleChange = (e) => {
    setAddnews((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (!addnews.news_text.trim()) {
      alert(t("settings.newsTextEmptyAlert")); // Ключ: "settings.newsTextEmptyAlert"
      return;
    }
    try {
      await axiosInstance.post("/news", addnews);
      // Очищення поля після успішного додавання новини
      setAddnews({ news_text: "" });
    } catch (err) {
      console.error(t("settings.addNewsError"), err); // Ключ: "settings.addNewsError"
    }
  };

  if (loading) {
    return <div>{t("settings.loading")}</div>; // Ключ: "settings.loading"
  }

  if (!userData) {
    return <div>{t("settings.userDataMissing")}</div>; // Ключ: "settings.userDataMissing"
  }

  return (
    <div className="settings">
      <div className="containerSennings">
        <h1>{t("settings.pageTitle")}</h1> {/* Ключ: "settings.pageTitle" */}

        <form onSubmit={(e) => e.preventDefault()}>
          <textarea
            className="textarea"
            type="text"
            placeholder={t("settings.newsTextPlaceholder")} // Ключ: "settings.newsTextPlaceholder"
            onChange={handleChange}
            name="news_text"
            value={addnews.news_text} // Додаємо значення поля
          />
          <button className="addNews" onClick={handleClick}>
            {t("settings.addNewsButton")} {/* Ключ: "settings.addNewsButton" */}
          </button>
        </form>
        <div className="user">
          <p>
            {t("settings.welcome")}, {userData.name}! {/* Ключ: "settings.welcome" */}
          </p>
          <p>
            {t("settings.id")}: {userData.id} {/* Ключ: "settings.id" */}
          </p>
          <p>
            {t("settings.email")}: {userData.email} {/* Ключ: "settings.email" */}
          </p>
          <p>
            {t("settings.userRole")}: {userData.role_name} {/* Ключ: "settings.userRole" */}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;