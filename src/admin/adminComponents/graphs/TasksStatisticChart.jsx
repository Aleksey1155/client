import React from "react";
import { Bar } from "react-chartjs-2";


const TasksStatisticChart = ({ data, selectedItem }) => {
  return (
    <Bar
      data={{
        labels: ["Усі завдання", "Виконані", "Незавершені", "Прострочені"],
        datasets: [
          {
            label: "Кількість завдань",
            data: [
              data?.length || 0, // Загальна кількість завдань
              data?.filter((task) => task.actual_end_date !== null).length || 0, // Виконані
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
            text: `Tasks Statistic ${
              selectedItem?.name ||
              selectedItem?.title ||
              "невідомого користувача"
            }`,
            color: "#777",
          },
        },
      }}
    />
  );
};

export default TasksStatisticChart;
