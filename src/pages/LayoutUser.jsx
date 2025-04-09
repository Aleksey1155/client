import React from "react";
import { Outlet } from "react-router-dom";
import "./layoutUser.scss";
import NavbarUser from "../components/navbaruser/NavbarUser";
import SidebarUser from "../components/sidebaruser/SidebarUser";
import useFetchUserDataWithCheck from "../../src/hooks/useFetchUserDataWithCheck";
// import { SocketProvider } from "../../src/SocketContext"; // Імпортуємо SocketProvider

const LayoutUser = () => {
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
      // <SocketProvider userData={userData}>
      <div className="layout">
        <SidebarUser />
        <div className="container">
          <NavbarUser userData={userData} />
          <Outlet  />  
        </div>
      </div>
      // </SocketProvider>
    );
    
  };

export default LayoutUser;