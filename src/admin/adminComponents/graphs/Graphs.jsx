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
import TaskScatterPlot from "./TaskScatterPlot";

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
  }, [selectedItem]);

  console.log("communication", communication);
  console.log("selectedItem", selectedItem);
  console.log("userData", communication);

  const filteredCommunicationData = communication.filter((entry) => {
    console.log(
      "entry.userId:",
      entry.userId,
      "selectedItem.id:",
      selectedItem.id
    );
    return entry.userId === selectedItem.id;
  });

  const groupedData = filteredCommunicationData.reduce((acc, entry) => {
    const date = new Date(entry.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { posts: 0, comments: 0, messages: 0 };
    }
    if (entry.type === "post") acc[date].posts++;
    if (entry.type === "comment") acc[date].comments++;
    if (entry.type === "message") acc[date].messages++;
    return acc;
  }, {});

  const labels = Object.keys(groupedData).sort((a, b) => {
    const [dayA, monthA, yearA] = a.split(".").map(Number);
    const [dayB, monthB, yearB] = b.split(".").map(Number);
    return (
      new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB)
    );
  });

  const postsData = labels.map((date) => groupedData[date].posts);
  const commentsData = labels.map((date) => groupedData[date].comments);
  const messagesData = labels.map((date) => groupedData[date].messages);

  console.log("Груповані дані:", groupedData);

  // Фільтруємо та сортуємо дані для Рейтинга
  const filteredRatingData = data
    .filter((task) => task.actual_end_date && task.task_rating)
    .sort((a, b) => new Date(a.actual_end_date) - new Date(b.actual_end_date));

  return (
    <div className="canvas-container">
      <div className="selectedItemInfo"></div>

      <h2>Key Performance Indicators</h2>
      <Competences
        userData={data}
        selectedItem={selectedItem}
        communication={communication}
      />
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
                    data?.length || 0,
                    data?.filter((task) => task.actual_end_date !== null)
                      .length || 0,
                    data?.filter(
                      (task) =>
                        task.actual_end_date === null &&
                        new Date(task.end_date) > new Date()
                    ).length || 0,
                    data?.filter(
                      (task) =>
                        task.actual_end_date === null &&
                        new Date(task.end_date) < new Date()
                    ).length || 0,
                  ],
                  backgroundColor: [
                    "rgba(43, 63, 229, 0.8)",
                    "rgba(38, 202, 23, 0.8)",
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
                  text: `Tasks Statistic ${
                    selectedItem?.name ||
                    selectedItem?.title ||
                    "невідомого користувача"
                  }`,
                  color: "#777",
                },
              },
              scales: {
                y: {
                  ticks: {
                    stepSize: 1, // Робить тільки цілі числа
                    beginAtZero: true, // Починає з 0
                  },
                },
              },
            }}
          />
        </div>
        {/* ++++++++++++++++++++++++++  communicationCard start  +++++++++++++++++++++++++++++++++++++++++ */}
        <div className="communicationCard">
          <Line
            data={{
              labels,
              datasets: [
                {
                  label: "Posts",
                  data: postsData, // Кількість постів у кожний день
                  backgroundColor: "#064FF0",
                  borderColor: "#064FF0",
                },
                {
                  label: "Comments",
                  data: commentsData, // Кількість коментарів у кожний день
                  backgroundColor: "#FF3030",
                  borderColor: "#FF3030",
                },
                {
                  label: "Messages",
                  data: messagesData, // Кількість повідомлень у кожний день
                  backgroundColor: "#26ca17ba",
                  borderColor: "#26ca17ba",
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
                  display: true,
                  text: `Communication of ${
                    selectedItem?.name || selectedItem?.title || "unknown user"
                  }`,
                  color: "#777",
                },
              },
              y: {
                ticks: {
                  stepSize: 1, // Робить тільки цілі числа
                  beginAtZero: true, // Починає з 0
                },
              },
            }}
          />
        </div>

        {/* ++++++++++++++++++++++++++  communicationCard end  +++++++++++++++++++++++++++++++++++++++++ */}
      </div>

      <div className="ratingTimeCard">
        <Line
          data={{
            labels: filteredRatingData.map((task) =>
              new Date(task.actual_end_date).toLocaleDateString("uk-UA")
            ),
            datasets: [
              {
                label: "Rating Task",
                data: filteredRatingData.map((task) => task.task_rating),
                borderColor: "#26ca17ba",
                backgroundColor: "#26ca17ba",
                tension: 0.3,
              },
            ],
          }}
          options={{
            x: {
              type: "time",
              time: {
                unit: "day",
                tooltipFormat: "yyyy-MM-dd",
                displayFormats: {
                  day: "yyyy-MM-dd",
                },
              },
            },
            y: {
              type: "linear",
              min: 1,
              max: 5,
              ticks: {
                stepSize: 1,
              },
            },
            plugins: {
              title: {
                text: `Rating Tasks of ${
                  selectedItem?.name ||
                  selectedItem?.title ||
                  "невідомого користувача"
                }`,
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
      {/* <div className="dateDeviationCard">
        <Line
          data={{
            labels: filteredRatingData.map((task) =>
              new Date(task.end_date).toLocaleDateString("uk-UA")
            ),
            datasets: [
              {
                label: "Deviation from Planned Date",
                data: filteredRatingData.map((task) => task.task_rating),
                borderColor: "#26ca17ba",
                backgroundColor: "#26ca17ba",
                tension: 0.3,
              },
            ],
          }}
          options={{
           
            y: {
              type: "linear",
              min: 0,
              max: 2,
              ticks: {
                stepSize: 1,
              },
            },
            plugins: {
              title: {
                text: `Deviation from Planned Date of ${
                  selectedItem?.name ||
                  selectedItem?.title ||
                  "невідомого користувача"
                }`,
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
      </div> */}
      <div className="taskScatterPlot">
        <TaskScatterPlot tasks = {data} selectedItem = {selectedItem}/>
      </div>
    </div>
  );
};

export default Graphs;
