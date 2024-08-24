
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";

const Layout = () => {
 
  
    return (
      <div className="layout">
        <Sidebar />
        <div className="layoutContainer">
          <Navbar />
          <Outlet  />  {/* Тут ми передаємо searchText у Outlet */}
        </div>
      </div>
    );
  };

export default Layout;
