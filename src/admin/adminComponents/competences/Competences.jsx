import { useState, useEffect } from "react";

function Competences({ userData, selectedItem, communication }) {
  const [quality, setQuality] = useState(0);
  const [trust, setTrust] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [workload, setWorkload] = useState(0);
  const [diligence, setDiligence] = useState(0);
  const [motivation, setMotivation] = useState(0);
  const [communicationPercentage, setCommunicationPercentage] = useState(0)

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

      // розрахунок
      if (userData.length > 0 && communication.length > 0) {
        const userId = userData[0].user_id; // Беремо user_id першого запису, оскільки всі у userData вже для одного користувача
        
        const userActivities = communication.filter((item) => item.userId === userId);
    
        const percentage = (userActivities.length / communication.length) * 100;
        setCommunicationPercentage(percentage.toFixed(2));
      }
      
    }
  }, [userData, communication]);
  console.log("communication", communication);

  return (
    <div className="competences">
      {selectedItem ? (
        <>
          <pre>{JSON.stringify(selectedItem, null, 2)}</pre>
          <div>{selectedItem.name}</div>
        </>
      ) : (
        <div>Виберіть об'єкт</div>
      )}

      <h2>Tasks</h2>
      <div className="list">
        {userData.length > 0 ? (
          userData.map((item, index) => (
            <div key={index} className="list-item">
              {JSON.stringify(item)}
            </div>
          ))
        ) : (
          <p>No data available</p>
        )}
      </div>

      <div className="ability">
        <div className="ability-item">Efficiency: {efficiency}%</div>
        <div className="ability-item">Quality: {quality}од.</div>
        <div className="ability-item">Workload: {workload}%</div>
        <div className="ability-item">Communication: {communicationPercentage}</div>
        <div className="ability-item">Trust: {trust}%</div>
        <div className="ability-item">Diligence Старанність: {diligence}%</div>
        <div className="ability-item">Motivation: {motivation}%</div>
      </div>
    </div>
  );
}

export default Competences;
