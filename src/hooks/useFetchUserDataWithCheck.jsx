import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Додано useNavigate
import axiosInstance from "../axiosInstance";

const useFetchUserDataWithCheck = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate(); // Ініціалізація useNavigate для перенаправлення

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axiosInstance.get("/me");
        // console.log("API Response:", res.data);

        if (res.data && res.data.id) {
          setUserData(res.data);
          setError(null);
        } else {
          setUserData(null);
          setError("Дані користувача відсутні.");
          localStorage.removeItem("token");
          navigate("/login"); // Перенаправляємо на сторінку входу
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setUserData(null);
        setError("Не вдалося отримати дані користувача.");
        localStorage.removeItem("token");
        navigate("/login"); // Перенаправляємо на сторінку входу у разі помилки
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [location, navigate]); // Додаємо navigate у залежності

  return { userData, loading, error };
};

export default useFetchUserDataWithCheck;
