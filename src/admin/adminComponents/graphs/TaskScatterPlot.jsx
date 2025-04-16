import React from "react";
import { Scatter } from "react-chartjs-2";
import { Chart, LinearScale, PointElement, Title, Tooltip, Legend } from "chart.js";
import { useTranslation } from "react-i18next";

Chart.register(LinearScale, PointElement, Title, Tooltip, Legend);

const TaskScatterPlot = ({ tasks, selectedItem }) => {
  const { t } = useTranslation();
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
        label: t("taskScatterPlot.taskCompletion"), // Ключ: "taskScatterPlot.taskCompletion"
        data: dataPoints,
        pointBackgroundColor: dataPoints.map((point) => point.backgroundColor),
        pointRadius: 6,
      },
      {
        label: t("taskScatterPlot.idealLine"), // Ключ: "taskScatterPlot.idealLine"
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
          text: t("taskScatterPlot.actualCompletionDate"), // Ключ: "taskScatterPlot.actualCompletionDate"
        },
      },
      y: {
        type: "linear",
        ticks: {
          callback: (val) => new Date(val).toLocaleDateString(),
        },
        title: {
          display: true,
          text: t("taskScatterPlot.plannedCompletionDate"), // Ключ: "taskScatterPlot.plannedCompletionDate"
        },
      },
    },
    plugins: {
      title: {
        text: `${t("taskScatterPlot.taskScatterPlotOf")} ${ // Ключ: "taskScatterPlot.taskScatterPlotOf"
          selectedItem?.name ||
          selectedItem?.title ||
          t("taskScatterPlot.unknownUser") // Ключ: "taskScatterPlot.unknownUser"
        }`,
        color: "#777",
        font: {
          size: 20,
          weight: "bold",
        },
      },
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (context) => `${t("taskScatterPlot.planned")}: ${new Date(context.raw.y).toLocaleDateString()}, ${t("taskScatterPlot.actual")}: ${new Date(context.raw.x).toLocaleDateString()}`, // Ключі: "taskScatterPlot.planned", "taskScatterPlot.actual"
        },
      },
    },
  };

  return <Scatter data={data} options={options} />;
};

export default TaskScatterPlot;