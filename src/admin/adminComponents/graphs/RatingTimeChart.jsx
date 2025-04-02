import React, { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const RatingTimeChart = ({ selectedItem, data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  const filteredData = data
    .filter((task) => task.actual_end_date && task.task_rating)
    .sort((a, b) => new Date(a.actual_end_date) - new Date(b.actual_end_date));

  const chartData = {
    labels: filteredData.map((task) => task.actual_end_date),
    datasets: [
      {
        label: "Rating Task",
        data: filteredData.map((task) => task.task_rating),
        borderColor: "#26ca17ba",
        backgroundColor: "#26ca17ba",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
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
    },
  };

  return <Line ref={chartRef} key={JSON.stringify(data)} data={chartData} options={options} />;
};

export default RatingTimeChart;
