
import { Outlet } from "react-router-dom";
import Navbar from "../adminComponents/navbar/Navbar";
import Sidebar from "../adminComponents/sidebar/Sidebar";

const LayoutAdmin = () => {
 
  
    return (
      <div className="layout">
        <Sidebar />
        <div className="layoutContainer">
          <Navbar />
          <Outlet  />  
        </div>
      </div>
    );
  };

export default LayoutAdmin;
