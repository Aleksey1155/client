import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInstance";
import { useParams, Link } from "react-router-dom";
import "./taskdetails.scss";
import TaskDatatable from "./TaskDatatable";
import ImageCarousel from "../../adminComponents/carousel/ImageCarousel";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [images, setImages] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axiosInstance.get(`/tasks/${id}`);
        setTask(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchImages = async () => {
      try {
        const res = await axiosInstance.get(`/task_images`);
        setImages(res.data.filter((image) => image.task_id === Number(id)));
      } catch (err) {
        console.log(err);
      }
    };

    fetchImages();
    fetchTask();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(i18n.language, options);
  };
  

  if (!task) {
    return <div>{t("taskdetails.loading")}</div>; // Ключ: "taskdetails.loading"
  }

  return (
    <div className="taskDetails">
      <div className="containerTaskDetails">
        <div className="topTaskDetails">
          <div className="leftTaskDetails">
            <div className="itemImgTask">
              <div className="titleTaskDetails">{t("taskdetails.information")}</div>{" "}
              {/* Ключ: "taskdetails.information" */}
              <img
                src={images.length > 0 ? images[0].url : ""}
                alt={task.title}
                className="itemImg"
              />
            </div>
            <div className="itemTaskDetails">
              <div className="editTaskDetails">
                <Link to={`/admin/update_task/${task.id}`} className="update">
                  {t("taskdetails.editTask")}{" "}
                  {/* Ключ: "taskdetails.editTask" */}
                </Link>
              </div>

              <div className="details">
                <div className="itemTitle">{task.title}</div>
                <div className="detailItem">
                  <span className="itemKey">{t("taskdetails.startDate")}:</span>{" "}
                  {/* Ключ: "taskdetails.startDate" */}
                  <span className="itemValue">
                    {formatDate(task.start_date)}
                  </span>
                  <span className="itemKey">{t("taskdetails.endDate")}:</span>{" "}
                  {/* Ключ: "taskdetails.endDate" */}
                  <span className="itemValue">{formatDate(task.end_date)}</span>
                  <span className="itemKey">
                    {t("taskdetails.actualEndDate")}:
                  </span>{" "}
                  {/* Ключ: "taskdetails.actualEndDate" */}
                  <span className="itemValue">
                    {task.actual_end_date
                      ? formatDate(task.actual_end_date)
                      : t("taskdetails.notCompleted")}{" "}
                    {/* Ключ: "taskdetails.notCompleted" */}
                  </span>
                  <span className="itemKey">
                    {t("taskdetails.taskStatus")}:
                  </span>{" "}
                  {/* Ключ: "taskdetails.taskStatus" */}
                  <span className="itemValue">{task.status_name}</span>
                  <span className="itemKey">
                    {t("taskdetails.taskPriority")}:
                  </span>{" "}
                  {/* Ключ: "taskdetails.taskPriority" */}
                  <span className="itemValue">{task.priority_name}</span>
                  <span className="itemKey">
                    {t("taskdetails.projectTitle")}:
                  </span>{" "}
                  {/* Ключ: "taskdetails.projectTitle" */}
                  <span className="itemProject">{task.project_title}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="title">{t("taskdetails.taskPictures")}</div>{" "}
            {/* Ключ: "taskdetails.taskPictures" */}
            <div className="carousel">
              <ImageCarousel images={images} />
            </div>
          </div>
        </div>
        <div className="bottom">
          <div className="title">{t("taskdetails.taskDescription")}</div>{" "}
          {/* Ключ: "taskdetails.taskDescription" */}
          <div dangerouslySetInnerHTML={{ __html: task.description }} />
        </div>
        <div className="taskDatatable">
          <TaskDatatable taskId={id} />
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
