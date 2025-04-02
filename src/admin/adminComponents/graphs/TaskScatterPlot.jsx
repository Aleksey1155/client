import React from "react";
import { Scatter } from "react-chartjs-2";
import { Chart, LinearScale, PointElement, Title, Tooltip, Legend } from "chart.js";

Chart.register(LinearScale, PointElement, Title, Tooltip, Legend);

const TaskScatterPlot = ({ tasks, selectedItem }) => {
  const dataPoints = tasks.map((task) => {
    if (!task.actual_end_date) return null; // Пропускаємо невиконані завдання
    const plannedDate = new Date(task.end_date).getTime();
    const actualDate = new Date(task.actual_end_date).getTime();
    const isEarly = actualDate < plannedDate;
    const isLate = actualDate > plannedDate;
    
    return {
      x: actualDate,
      y: plannedDate,
      backgroundColor: isEarly ? "green" : isLate ? "red" : "blue",
    };
  }).filter(Boolean);

  const data = {
    datasets: [
      {
        label: "Task Completion",
        data: dataPoints,
        pointBackgroundColor: dataPoints.map((point) => point.backgroundColor),
        pointRadius: 6,
      },
      {
        label: "Ideal Line",
        data: [
          { x: Math.min(...dataPoints.map((p) => p.x)), y: Math.min(...dataPoints.map((p) => p.y)) },
          { x: Math.max(...dataPoints.map((p) => p.x)), y: Math.max(...dataPoints.map((p) => p.y)) },
        ],
        borderColor: "gray",
        borderWidth: 1,
        showLine: true,
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        ticks: {
          callback: (val) => new Date(val).toLocaleDateString(),
        },
        title: {
          display: true,
          text: "Фактична дата завершення",
        },
      },
      y: {
        type: "linear",
        ticks: {
          callback: (val) => new Date(val).toLocaleDateString(),
        },
        title: {
          display: true,
          text: "Запланована дата завершення",
        },
      },
    },
    plugins: {
      title: {
        text: `Task Scatter Plot of ${
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
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (context) => `Planned: ${new Date(context.raw.y).toLocaleDateString()}, Actual: ${new Date(context.raw.x).toLocaleDateString()}`,
        },
      },
    },
  };

  return <Scatter data={data} options={options} />;
};

export default TaskScatterPlot;
