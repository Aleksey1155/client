import React from "react";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Dashboard from "../../components/dashboard/Dashboard";
import Graphs from "../../components/graph/Graphs";


function Home() {
  return (
    <div className="home">
      
      <div className="homeContainer">
      <div className="research">research</div>
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
        
         
        
      </div>
    </div>
  );
}

export default Home;