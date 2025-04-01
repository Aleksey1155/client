import React from "react";
import { Outlet } from "react-router-dom";
import "./layoutAdmin.scss";
import Navbar from "../adminComponents/navbar/Navbar";
import Sidebar from "../adminComponents/sidebar/Sidebar";
import useFetchUserDataWithCheck from "../../hooks/useFetchUserDataWithCheck";


const LayoutAdmin = () => {
  const { userData, loading, error } = useFetchUserDataWithCheck(); // Виклик хуку для перевірки
  

  // console.log("User Data:", userData); 
  // console.log("Loading State:", loading);
  // console.log("Error State:", error); 

  if (loading) {
    return <div>Loading...</div>; // Показуємо стан завантаження
  }

  if (error) {
    return <div>{error}</div>; // Якщо сталася помилка
  }

  if (!userData) {
    return <div>Дані користувача відсутні.</div>; // Якщо даних немає
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="container">
        <Navbar />
        <Outlet /> 
        {/* Вміст поточної сторінки */}
      </div>
    </div>
  );
};

export default LayoutAdmin;
