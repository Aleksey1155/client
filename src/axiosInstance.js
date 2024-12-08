import axios from "axios";
import config from "./config"

const axiosInstance = axios.create({
  baseURL: `${config.baseURL}`,
});

// Інтерцептор для додавання токена до кожного запиту
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;  // Додаємо токен до заголовка
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Інтерцептор для обробки відповідей
axiosInstance.interceptors.response.use(
  (response) => {
    return response;  // Успішна відповідь
  },
  (error) => {
    // Перевірка на статус 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");  // Видаляємо токен
      window.location.href = "/login";  // Перенаправляємо на сторінку логіну
    }
    return Promise.reject(error);  // Відхиляємо помилку для подальшої обробки
  }
);

export default axiosInstance;

