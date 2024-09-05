import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";

const LayoutUser = () => {
 
  
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