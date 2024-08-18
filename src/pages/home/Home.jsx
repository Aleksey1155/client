import React from "react";
import "./home.scss";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Widget from "../../components/widget/Widget";
import Dashboard from "../../components/dashboard/Dashboard";
import Graphs from "../../components/graph/Graphs";
import Table from "../../components/table/Table";

function Home() {
  return (
    <div className="home">
      
      <div className="homeContainer">
        
        <div className="widgets">
          <Widget type="user" />
          <Widget type="project" />
          <Widget type="expense" />
          <Widget type="balance" />
        </div>
        <div className="charts">
          
          <Graphs />
        </div>
        <div className="dashboard"><Dashboard /></div>
        {/* <div className="listContainer">
          <div className="listTitle"> Spare table</div>
          <Table/>
        </div> */}
      </div>
    </div>
  );
}

export default Home;
