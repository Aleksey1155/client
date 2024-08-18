import { Bar, Line } from "react-chartjs-2";
import React from "react";
import { Chart, registerables } from "chart.js";
import { Link } from "react-router-dom";
import "./graph.scss";
import projectsData from "/src/assets/projectsData.json";
import usersData from "/src/assets/usersData.json";
import sourceData from "/src/assets/sourceData.json";
import { grey } from "@mui/material/colors";

Chart.register(...registerables);

// Налаштування глобальних параметрів
Chart.defaults.maintainAspectRatio = false;
Chart.defaults.responsive = true;
Chart.defaults.plugins.title.display = true;
Chart.defaults.plugins.title.align = "start";
Chart.defaults.plugins.title.font.size = 20;
Chart.defaults.plugins.title.color = "black";

const Graphs = () => {
  return (
    <div className="canvas-container">
      <div className="graphContainer">
        <div className="customerCard">
          <Bar
            data={{
              labels: sourceData.map((data) => data.label),
              datasets: [
                {
                  label: "Всього прийнятих в розробку проектів",
                  data: sourceData.map((data) => data.value),
                  backgroundColor: [
                    "rgba(43, 63, 229, 0.8)",
                    "rgba(250, 192, 19, 0.8)",
                    "rgba(253, 135, 135, 0.8)",
                  ],
                  borderRadius: 5,
                },
              ],
            }}
            options={{
              plugins: {
                title: {
                  text: "Статистика проектів",
                  color: "#555", // Так менять цвет шрифта!!!!!!!!!!!!!!!
                },
              },
            }}
          />
        </div>
        <div className="projectCard">
          <Line
            data={{
              labels: projectsData.map((data) => data.label),
              datasets: [
                {
                  label: "Вартість проектів USD",
                  data: projectsData.map((data) => data.revenue),
                  backgroundColor: "#064FF0",
                  borderColor: "#064FF0",
                },
              ],
            }}
            options={{
              elements: {
                line: {
                  tension: 0.5,
                },
              },
              plugins: {
                title: {
                  text: "Вартість проектів USD",
                  color: "#555",
                },
              },
            }}
          />
        </div>
      </div>

      <div className="revenueCard">
        <Line
          data={{
            labels: usersData.map((data) => data.label),
            datasets: [
              {
                label: "Напросов В.В.",
                data: usersData.map((data) => data.user1),
                backgroundColor: "#064FF0",
                borderColor: "#064FF0",
              },
              {
                label: "Зинко Т. Н.",
                data: usersData.map((data) => data.user2),
                backgroundColor: "#FF3030",
                borderColor: "#FF3030",
              },
              {
                label: "Вілородов М. С.",
                data: usersData.map((data) => data.user3),
                backgroundColor: "#26ca17ba",
                borderColor: "#26ca17ba",
              },
              {
                label: "Денев Р. К.",
                data: usersData.map((data) => data.user4),
                backgroundColor: "#ebd831f6",
                borderColor: "#ebd831f6",
              },
              {
                label: "Кущістко В. У.",
                data: usersData.map((data) => data.user5),
                backgroundColor: "#879c98ba",
                borderColor: "#879c98ba",
              },
            ],
          }}
          options={{
            elements: {
              line: {
                tension: 0.5,
              },
            },
            plugins: {
              title: {
                text: "Бонуси персоналу USD",
                color: "#555",
                font: {
                  size: 20, // Так менять размер шрифта!!!!!!!!!!!!!!!
                  weight: 'bold', // Font weight
                  // family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif" // Font family
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Graphs;
