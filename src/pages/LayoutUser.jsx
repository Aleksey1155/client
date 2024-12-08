import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import useFetchUserDataWithCheck from "../../src/hooks/useFetchUserDataWithCheck";

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
      <div className="layout">
        <Sidebar />
        <div className="container">
          <Navbar />
          <Outlet  />  
        </div>
      </div>
    );
  };

export default LayoutUser;