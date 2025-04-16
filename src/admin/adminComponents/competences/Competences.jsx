import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./competences.scss"

function Competences({ userData, selectedItem, communication }) {
  const { t } = useTranslation();
  const [quality, setQuality] = useState(0);
  const [trust, setTrust] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [workload, setWorkload] = useState(0);
  const [diligence, setDiligence] = useState(0);
  const [motivation, setMotivation] = useState(0);
  const [communicationPercentage, setCommunicationPercentage] = useState(0);

  useEffect(() => {
    if (userData.length > 0) {
      // розрахунок Quality якості роботи від 1 до 5 од. серед рейтинг
      const totalRating = userData.reduce(
        (sum, item) => sum + item.task_rating,
        0
      );
      const avgQuality = totalRating / userData.length;
      setQuality(avgQuality.toFixed(2)); // Округлюємо до 2 знаків

      // розрахунок Trust рівень довіри в відсот
      const highPriorityTasks = userData.filter(
        (task) => task.task_priorities_id === 1
      );
      const completedOnTime = highPriorityTasks.filter(
        (task) =>
          task.actual_end_date !== null &&
          new Date(task.actual_end_date) <= new Date(task.end_date)
      );

      const trustLevel =
        highPriorityTasks.length > 0
          ? (completedOnTime.length / highPriorityTasks.length) * 100
          : 0;

      setTrust(trustLevel.toFixed(2));

      // розрахунок Efficiency рівень ефктивності в відсот.
      const completedTasks = userData.filter(
        (task) => task.actual_end_date !== null
      );
      const totalTasks = userData.length;

      const earlyCompletedTasks = completedTasks.filter(
        (task) => new Date(task.actual_end_date) < new Date(task.end_date)
      );

      const efficiency =
        totalTasks > 0
          ? (completedTasks.length / totalTasks) * 50 +
            (completedTasks.length > 0
              ? (earlyCompletedTasks.length / completedTasks.length) * 50
              : 0)
          : 0;
      setEfficiency(efficiency.toFixed(2));

      // розрахунок Workload завантаженніть
      const getActiveTasks = () => {
        const today = new Date();
        return userData.filter(
          (task) =>
            new Date(task.start_date) <= today &&
            (task.actual_end_date === null ||
              new Date(task.actual_end_date) > today)
        );
      };

      const activeTasks = getActiveTasks();
      const maxConcurrentTasks = Math.max(
        ...userData.map(
          (task) =>
            userData.filter(
              (t) =>
                new Date(t.start_date) <= new Date(task.end_date) &&
                (t.actual_end_date === null ||
                  new Date(t.actual_end_date) > new Date(task.start_date))
            ).length
        ),
        1
      );

      const avgPriority =
        activeTasks.length > 0
          ? activeTasks.reduce(
              (sum, task) => sum + task.task_priorities_id,
              0
            ) / activeTasks.length
          : 1;

      const maxPriority = Math.max(
        ...userData.map((task) => task.task_priorities_id),
        1
      );

      const workload =
        (activeTasks.length / maxConcurrentTasks) * 50 +
        (avgPriority / maxPriority) * 50;

      setWorkload(workload.toFixed(2));

      // розрахунок Diligence Старанність вже було const completedTasks,const totalTasks,const maxPriority
      const onTimeCompletedTasks = completedTasks.filter(
        (task) => new Date(task.actual_end_date) <= new Date(task.end_date)
      );

      const avgPriorityCompleted =
        completedTasks.length > 0
          ? completedTasks.reduce(
              (sum, task) => sum + task.task_priorities_id,
              0
            ) / completedTasks.length
          : 1;
      const diligence =
        (completedTasks.length / totalTasks) * 40 +
        (onTimeCompletedTasks.length / completedTasks.length) * 40 +
        (avgPriorityCompleted / maxPriority) * 20;

      setDiligence(diligence.toFixed(2));

      // розрахунок мотивації Motivation, Було const onTimeCompletedTasks,const completedTasks
      const acceptedTasks = userData.length; // Кількість прийнятих завдань
      const completedCount = completedTasks.length;

      const avgTaskRating =
        completedTasks.length > 0
          ? completedTasks.reduce((sum, task) => sum + task.task_rating, 0) /
            completedTasks.length
          : 1;

      const maxRating = Math.max(
        ...userData.map((task) => task.task_rating),
        1
      );

      const motivation =
        (completedCount / acceptedTasks) * 30 +
        (onTimeCompletedTasks.length / completedCount) * 30 +
        (avgTaskRating / maxRating) * 40;

      setMotivation(motivation.toFixed(2));

      // розрахунок відсотка комунікації
      if (userData.length > 0 && communication.length > 0) {
        const userId = userData[0].user_id; // Беремо user_id першого запису
        const userActivities = communication.filter((item) => item.userId === userId);
        const percentage = (userActivities.length / communication.length) * 100;
        setCommunicationPercentage(percentage.toFixed(2));
      }
    }
  }, [userData, communication]);

  return (
    <div className="competences">
      {/* {selectedItem ? (
        <>
          <pre>{JSON.stringify(selectedItem, null, 2)}</pre>
          <div><h2>{selectedItem.name}</h2></div>
        </>
      ) : (
        <div><h2>{t("competences.selectObject")}</h2></div> // Ключ: "competences.selectObject"
      )} */}

      {/* <h2>{t("competences.tasks")}</h2> Ключ: "competences.tasks" */}
      {/* <div className="list">
        {userData.length > 0 ? (
          userData.map((item, index) => (
            <div key={index} className="list-item">
              {JSON.stringify(item)}
            </div>
          ))
        ) : (
          <p>{t("competences.noData")}</p> // Ключ: "competences.noData"
        )}
      </div> */}

      <div className="ability">
        <div className="ability-item">{t("competences.efficiency")}: {efficiency}%</div> {/* Ключ: "competences.efficiency" */}
        <div className="ability-item">{t("competences.quality")}: {quality} од.</div> {/* Ключ: "competences.quality" */}
        <div className="ability-item">{t("competences.workload")}: {workload}%</div> {/* Ключ: "competences.workload" */}
        <div className="ability-item">{t("competences.communication")}: {communicationPercentage}%</div> {/* Ключ: "competences.communication" */}
        <div className="ability-item">{t("competences.trust")}: {trust}%</div> {/* Ключ: "competences.trust" */}
        <div className="ability-item">{t("competences.diligence")}: {diligence}%</div> {/* Ключ: "competences.diligence" */}
        <div className="ability-item">{t("competences.motivation")}: {motivation}%</div> {/* Ключ: "competences.motivation" */}
      </div>
    </div>
  );
}

export default Competences;