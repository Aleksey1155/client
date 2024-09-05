import React from "react";
import "./statistics.scss";
import Widget from "../../adminComponents/widget/Widget";

import Graphs from "../../adminComponents/graph/Graphs";

function Statistics() {
  return (
    <div className="statistics">
      <div className="container">
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
        
      </div>
    </div>
  );
}

export default Statistics;
