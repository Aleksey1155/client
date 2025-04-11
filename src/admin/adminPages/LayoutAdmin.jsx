import React from "react";
import { Outlet } from "react-router-dom";
import "./layoutAdmin.scss";
import NavbarAdmin from "../adminComponents/navbarAdmin/NavbarAdmin";
import useFetchUserDataWithCheck from "../../hooks/useFetchUserDataWithCheck";
import SidebarAdmin from "../adminComponents/sidebarAdmin/SidebarAdmin";
import { SocketProvider } from "../../SocketContext"; 

const LayoutAdmin = () => {
  const { userData, loading, error } = useFetchUserDataWithCheck(); // Виклик хуку для перевірки

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
   <SocketProvider>
      <div className="layout">
        <SidebarAdmin />
        <div className="container">
          <NavbarAdmin userData={userData} />
          <Outlet /> {/* Вміст поточної сторінки */}
        </div>
      </div>
    </SocketProvider>
  );
};

export default LayoutAdmin;
