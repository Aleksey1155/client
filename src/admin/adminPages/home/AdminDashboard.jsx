import React from "react";
import "./admindashboard.scss";

import DashboardTable from "../../adminComponents/dashboardtable/DashboardTable";



function AdminDashboard() {
  return (
    <div className="home">
      
      <div className="container">
      {/* <div className="research">research</div> */}
        
        
        <div className="dashboard"><DashboardTable /></div>
        
         
        
      </div>
    </div>
  );
}

export default AdminDashboard;
