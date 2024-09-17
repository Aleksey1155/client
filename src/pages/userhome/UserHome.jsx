import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./userHome.scss";
import News from "../../components/news/News";
import CalendarModal from "../../components/calendarmodal/CalendarModal";
import Kanban from "../../components/kanban/Kanban";

function UserHome() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [homeData, setHomeData] = useState([]);

  const navigate = useNavigate();

  const isAdmin = location.pathname.includes("/admin");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:3001/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    const fetchHomeData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get("http://localhost:3001/home");
        // console.log("Home data:", res.data); // Лог для перевірки даних
        setHomeData(Array.isArray(res.data) ? res.data : []); // array
      } catch (err) {
        console.log(err);
      }
    };

    fetchHomeData();
    fetchUserData();
  }, [navigate]);

  // console.log(homeData);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>Дані користувача відсутні.</div>;
  }

  // Групуємо завдання за проектами і збираємо зображення користувачів та їх id у масиви
  const projectsMap = homeData.reduce((acc, item) => {
    const {
      project_id,
      project_title,
      project_end_date,
      project_status,
      task_id,
      task_title,
      task_description,
      task_start_date,
      task_end_date,
      user_image,
      user_id,
      task_status,
    } = item;

    if (!acc[project_id]) {
      acc[project_id] = {
        project_id,
        project_title,
        project_end_date,
        project_status,
        tasks: {},
      };
    }

    if (!acc[project_id].tasks[task_id]) {
      acc[project_id].tasks[task_id] = {
        task_id,
        task_title,
        task_description: task_description.slice(0, 40), // Скорочуємо опис до 20 символів
        task_end_date,
        task_status,
        user_images: [],
        user_ids: [], // Додаємо масив для user_id
      };
    }

    // Додаємо зображення користувача та його id до відповідних масивів
    acc[project_id].tasks[task_id].user_images.push(user_image);
    acc[project_id].tasks[task_id].user_ids.push(user_id); // Додаємо user_id до масиву user_ids

    return acc;
  }, {});

  const projects = Object.values(projectsMap).map((project) => ({
    ...project,
    tasks: Object.values(project.tasks),
  }));
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  // Функція для перевірки, чи є дата кінця завдання близькою до поточної дати (2 дні)
  const isCloseToEnd = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= 2 && diffDays >= 0;
  };

  // Функція для перевірки, чи дата закінчилась і статус "Виконується"
  const isEndDatePassedAndInProgress = (endDate, taskStatus) => {
    const today = new Date();
    const end = new Date(endDate);

    // Перевірка, чи дата закінчилась і статус завдання "Виконується"
    return end < today && taskStatus === "Виконується";
  };

  // Функція для перевірки, чи дата за два дні до кінця і статус "Виконується"
  const isProgress = (endDate, taskStatus) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    // Перевіряємо чи більше ніж 2 дні і чи статус "Виконується"
    return diffDays > 2 && taskStatus === "Виконується";
  };
  

  const uniqueTasks = homeData.reduce((acc, current) => {
    const x = acc.find((item) => item.task_id === current.task_id);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  return (
    <div className="userHome">
      <div className="container">
        <span className="title">User Home</span>
        <div className="top">
          <div className="topCalendar">
            <CalendarModal tasks={uniqueTasks} />
            {/* додав CalendarModal */}
          </div>

          <div className="topKanban">
            <Kanban userId={userData.id} />
          </div>
          <div className="topDiscussions">
            <span className="title">Discussions</span>
          </div>
          <div className="topFiles">
            <span className="title">Files</span>
          </div>
        </div>

        {/* Фільтруємо проекти і завдання для користувачів */}
        {projects
          .sort((a, b) => b.project_id - a.project_id) // Сортуємо проекти в зворотньому порядку за project_id
          .filter((project) => {
            // console.log("Projects before filtering:", project);

            // Якщо роль - admin, показуємо всі проекти
            if (userData.role_name === "admin") {
              return true;
            }

            // Інакше фільтруємо лише ті, в яких користувач бере участь
            const isUserInvolved = project.tasks.some(
              (task) => task.user_ids.includes(userData.id) // Перевіряємо, чи є user_id у масиві user_ids
            );
            console.log(
              `User ${userData.id} involved in project ${project.project_id}:`,
              isUserInvolved
            );

            return isUserInvolved;
          })
          .map((project) => (
            <div key={project.project_id} className="project">
              <div className="projectbord">
                <div className="projectTitle">{project.project_title}</div>
                <div className="projectInfo">
                  <span className="projectStatus">
                    {project.project_status}
                  </span>
                  <span className="projectEndDate">
                    {formatDate(project.project_end_date)}
                  </span>
                </div>
              </div>

              <div className="taskbord">
                {project.tasks.map((task) => (
                  <div key={task.task_id} className="task">
                    <Link
                      to={
                        isAdmin
                          ? `/admin/task_details/${task.task_id}`
                          : `/task_details/${task.task_id}`
                      }
                    >
                      <div className="topTaskTitle">
                      <div className="taskTitle">{task.task_title}</div>
                      <div className={`stateTask ${
                         isCloseToEnd(task.task_end_date)
                         ? "closeToEnd"
                         : isEndDatePassedAndInProgress(
                             task.task_end_date,
                             task.task_status
                           )
                         ? "endPassedInProgress"
                         : isProgress(
                          task.task_end_date,
                          task.task_status
                        )
                          ? "progress"
                          : ""

                        }`}></div>
                      </div>
                      <div
                        className="taskDesc"
                        dangerouslySetInnerHTML={{
                          __html: task.task_description,
                        }}
                      />
                    </Link>
                    <div className="usersImg">
                      {task.user_images.map((image, index) => (
                        <img key={index} src={image} alt="" />
                      ))}
                    </div>

                    <div className="taskInfo">
                      <span className={`taskStatus ${task.task_status}`}>
                        {task.task_status}
                      </span>
                      <span
                        className={`taskEndDate ${
                          isCloseToEnd(task.task_end_date)
                            ? "closeToEnd"
                            : isEndDatePassedAndInProgress(
                                task.task_end_date,
                                task.task_status
                              )
                            ? "endPassedInProgress"
                            : ""
                        }`}
                      >
                        {formatDate(task.task_end_date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

        <div className="user">
          <p>Welcome, {userData.name}!</p>
          <p>
            Email: {userData.email} ID: {userData.id}
          </p>
          <p>User Role: {userData.role_name}</p>
        </div>
      </div>
      <News />
    </div>
  );
}

export default UserHome;
