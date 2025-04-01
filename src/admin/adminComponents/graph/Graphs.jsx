import { Bar, Line } from "react-chartjs-2";
import { useState, useEffect } from "react";
import axiosInstance from "../../../axiosInstance";
import { useParams } from "react-router-dom";
import { Chart, registerables } from "chart.js";
import { Link } from "react-router-dom";
import "./graphs.scss";
import projectsData from "/src/assets/projectsData.json";
import usersData from "/src/assets/usersData.json";
import sourceData from "/src/assets/sourceData.json";
import { grey } from "@mui/material/colors";
import Competences from "../competences/Competences";

Chart.register(...registerables);

// Налаштування глобальних параметрів
Chart.defaults.maintainAspectRatio = false;
Chart.defaults.responsive = true;
Chart.defaults.plugins.title.display = true;
Chart.defaults.plugins.title.align = "center";
Chart.defaults.plugins.title.font.size = 20;
Chart.defaults.plugins.title.color = "#555";

const Graphs = ({ selectedItem }) => {
  const [data, setData] = useState([]);
  const [communication, setCommunication] = useState([]);


  useEffect(() => {
    if (!selectedItem?.id) return; // Перевіряємо, чи є обраний елемент
    const fetchData = async () => {
      try {
        const endpoint = `/userdetails/${selectedItem.id}`;

        if (!endpoint) return;

        const res = await axiosInstance.get(endpoint);
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchCommunicationData = async () => {
      try {
        const res = await axiosInstance.get(`/api/communication-stats`);
        setCommunication(res.data);
      } catch (err) {
        console.log(err);
      }
    };



    

    fetchData();
    fetchCommunicationData();
  }, [selectedItem ]);

  // console.log(communication)

  return (
    <div className="canvas-container">
      <div className="selectedItemInfo">
        <h3>Вибраний об'єкт</h3>
        {/* {selectedItem ? (
          <>
            <pre>{JSON.stringify(selectedItem, null, 2)}</pre>
            <div>{selectedItem.name || selectedItem.title}</div>
          </>
        ) : (
          <div>Виберіть об'єкт</div>
        )} */}
      </div>
      {/* <h2>Tasks </h2>
      <div className="list">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div key={index} className="list-item">
              {JSON.stringify(item)}
            </div>
          ))
        ) : (
          <p>No data available</p>
        )}
      </div> */}
      <h2>Key Performance Indicators</h2>
      <Competences userData = {data} selectedItem={selectedItem} communication={communication} />
      <div className="graphContainer">
        <div className="customerCard">


          <Bar
            data={{
              labels: [
                "Усі завдання",
                "Виконані",
                "Незавершені",
                "Прострочені",
              ],
              datasets: [
                {
                  label: "Кількість завдань",
                  data: [
                    data?.length || 0, // Загальна кількість завдань
                    data?.filter((task) => task.actual_end_date !== null)
                      .length || 0, // Виконані
                    data?.filter(
                      (task) =>
                        task.actual_end_date === null &&
                        new Date(task.end_date) > new Date()
                    ).length || 0, // Незавершені
                    data?.filter(
                      (task) =>
                        task.actual_end_date === null &&
                        new Date(task.end_date) < new Date()
                    ).length || 0, // Прострочені
                  ],
                  backgroundColor: [
                    "rgba(43, 63, 229, 0.8)", // Синій (всього)
                    "rgba(38, 202, 23, 0.8)", // Зелений (виконані)
                    "rgba(250, 192, 19, 0.8)", // Жовтий (незавершені)
                    "rgba(253, 135, 135, 0.8)", // Червоний (прострочені)
                  ],
                  borderRadius: 5,
                },
              ],
            }}
            options={{
              plugins: {
                title: {
                  text: `Статистика завдань для ${
                    selectedItem?.name ||
                    selectedItem?.title ||
                    "невідомого користувача"
                  }`,
                  color: "#777",
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
                  color: "#777",
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
                color: "#777",
                font: {
                  size: 20, // Так менять размер шрифта!!!!!!!!!!!!!!!
                  weight: "bold", // Font weight
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
