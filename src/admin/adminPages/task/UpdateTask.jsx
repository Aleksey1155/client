import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../axiosInstance";
import ReactQuill from "react-quill";
import { DateTime } from "luxon";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import "./updatetask.scss";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import Zoom from "react-medium-image-zoom";
import { useTranslation } from "react-i18next";

const UpdateTask = () => {
  const { t } = useTranslation();
  const [task, setTask] = useState({
    project_id: "",
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    priority_id: "",
    actual_end_date: "",
    status_id: "",
    rating: "",
  });

  const filePicker = useRef(null);
  const [statuses, setStatuses] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [projects, setProjects] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploaded, setUploaded] = useState();
  const [images, setImages] = useState([]);

  const navigate = useNavigate();
  const { id: taskId } = useParams();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axiosInstance.get(`/tasks/${taskId}`);
        const taskData = res.data;
        setTask({
          project_id: taskData.project_id,
          title: taskData.title,
          description: taskData.description,
          start_date: taskData.start_date
            ? DateTime.fromISO(taskData.start_date).toISODate()
            : "",
          end_date: taskData.end_date
            ? DateTime.fromISO(taskData.end_date).toISODate()
            : "",
          actual_end_date: taskData.actual_end_date
            ? DateTime.fromISO(taskData.actual_end_date).toISODate()
            : "",
          priority_id: taskData.priority_id,
          status_id: taskData.status_id,
          rating: taskData.rating,
        });
      } catch (err) {
        console.log(err);
      }
    };

    const fetchStatuses = async () => {
      try {
        const res = await axiosInstance.get("/task_statuses");
        setStatuses(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchPriorities = async () => {
      try {
        const res = await axiosInstance.get("/task_priorities");
        setPriorities(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchImages = async () => {
      try {
        const res = await axiosInstance.get(`/task_images`);
        setImages(res.data.filter((image) => image.task_id === Number(taskId)));
      } catch (err) {
        console.log(err);
      }
    };

    const fetchAllProjects = async () => {
      try {
        const res = await axiosInstance.get("/projects"); // Запит на отримання всіх проєктів
        setProjects(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllProjects();
    fetchImages();
    fetchTask();
    fetchStatuses();
    fetchPriorities();
  }, [taskId]);

  const handleChange = (e) => {
    setTask((prev) => ({
      ...prev,
      [e.target.name]: e.target.value === "" ? null : e.target.value,
    }));
  };

  const handleEditorChange = (content) => {
    setTask((prev) => ({ ...prev, description: content }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    const updatedTask = {
      ...task,
      actual_end_date: task.actual_end_date || null,
    };

    try {
      await axiosInstance.put(`/tasks/${taskId}`, updatedTask);
      navigate(`/admin/task/${taskId}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteImg = async (id) => {
    const confirmed = window.confirm(
      t("updatetask.deleteImageConfirmation") // Ключ: "updatetask.deleteImageConfirmation"
    );
    if (confirmed) {
      try {
        await axiosInstance.delete("/task_images/" + id);
        setImages(images.filter((image) => image.id !== id));
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleFileChange = (event) => {
    console.log(event.target.files); //--------------------------------
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  //*********************************************************** */

  const handleUpload = async () => {
    if (!selectedFile) {
      alert(t("updatetask.selectFileAlert")); // Ключ: "updatetask.selectFileAlert"
      return;
    }

    const formData = new FormData();
    formData.append("files", selectedFile);
    formData.append("task_id", taskId); // Передаємо project_id

    try {
      const res = await axiosInstance.post("/upload_task", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Selected File: ", selectedFile);
      console.log("Upload Response: ", res.data);

      setUploaded(res.data);

      setTimeout(() => {
        navigate(0);
      }, 1000);
    } catch (error) {
      console.error("Upload Error: ", error);
      alert(t("updatetask.uploadFileErrorAlert")); // Ключ: "updatetask.uploadFileErrorAlert"
    }
  };
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  const handlePick = () => {
    filePicker.current.click();
  };

  return (
    <div className="updatetask">
      <div className="updatetaskContainer">
        <div className="top">
          <p className="title">{t("updatetask.updateTaskTitle")}</p> {/* Ключ: "updatetask.updateTaskTitle" */}
          <button className="button" onClick={handleClick}>
            {t("updatetask.editButton")} {/* Ключ: "updatetask.editButton" */}
          </button>
        </div>
        <div className="center">
          <div className="left">
            <div>
              <button className="buttonAddFile" onClick={handlePick}>
                {t("updatetask.addFileButton")} {/* Ключ: "updatetask.addFileButton" */}
              </button>
              <input
                className="hidden"
                ref={filePicker}
                type="file"
                onChange={handleFileChange}
                accept="image/*, .png, .jpg, .web"
              />
              <button className="buttonAddFile" onClick={handleUpload}>
                {t("updatetask.uploadNowButton")} {/* Ключ: "updatetask.uploadNowButton" */}
              </button>
            </div>

            {!selectedFile && (
              <img
                className="noimage"
                src="https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                alt={t("updatetask.noImageAlt")} // Ключ: "updatetask.noImageAlt"
              />
            )}

            {selectedFile && !uploaded && (
              <div className="selectedFile">
                <ul>
                  <li>{t("updatetask.fileName")}: {selectedFile.name}</li> {/* Ключ: "updatetask.fileName" */}
                  <li>{t("updatetask.fileType")}: {selectedFile.type}</li> {/* Ключ: "updatetask.fileType" */}
                  <li>{t("updatetask.fileSize")}: {selectedFile.size}</li> {/* Ключ: "updatetask.fileSize" */}
                </ul>
              </div>
            )}

            {uploaded && uploaded.uploadedFiles.length > 0 && (
              <div>
                <h2>{uploaded.uploadedFiles[0].fileName}</h2>
                <img
                  className="image"
                  src={uploaded.uploadedFiles[0].filePath}
                  alt={uploaded.uploadedFiles[0].fileName}
                />
              </div>
            )}
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label>{t("updatetask.taskTitleLabel")}</label> {/* Ключ: "updatetask.taskTitleLabel" */}
                <input
                  className="input"
                  type="text"
                  placeholder={t("updatetask.taskTitlePlaceholder")} // Ключ: "updatetask.taskTitlePlaceholder"
                  onChange={handleChange}
                  name="title"
                  value={task.title}
                />
              </div>
              <div className="formInput">
                <label>{t("updatetask.projectLabel")}</label> {/* Ключ: "updatetask.projectLabel" */}
                <select
                  className="select"
                  name="project_id"
                  onChange={handleChange}
                  value={task.project_id}
                >
                  <option value="" disabled>
                    {t("updatetask.selectProjectOption")} {/* Ключ: "updatetask.selectProjectOption" */}
                  </option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>
              <div
                className="formInput"
                onClick={(e) =>
                  e.currentTarget.querySelector("input").showPicker()
                }
              >
                <label>{t("updatetask.startDateLabel")}</label> {/* Ключ: "updatetask.startDateLabel" */}
                <input
                  className="inputDate"
                  type="date"
                  placeholder={t("updatetask.startDatePlaceholder")} // Ключ: "updatetask.startDatePlaceholder"
                  onChange={handleChange}
                  name="start_date"
                  value={task.start_date}
                />
              </div>
              <div
                className="formInput"
                onClick={(e) =>
                  e.currentTarget.querySelector("input").showPicker()
                }
              >
                <label>{t("updatetask.endDateLabel")}</label> {/* Ключ: "updatetask.endDateLabel" */}
                <input
                  className="inputDate"
                  type="date"
                  placeholder={t("updatetask.endDatePlaceholder")} // Ключ: "updatetask.endDatePlaceholder"
                  onChange={handleChange}
                  name="end_date"
                  value={task.end_date}
                />
              </div>
              <div
                className="formInput"
                onClick={(e) =>
                  e.currentTarget.querySelector("input").showPicker()
                }
              >
                <label>{t("updatetask.actualEndDateLabel")}</label> {/* Ключ: "updatetask.actualEndDateLabel" */}
                <input
                  className="inputDate"
                  type="date"
                  placeholder={t("updatetask.actualEndDatePlaceholder")} // Ключ: "updatetask.actualEndDatePlaceholder"
                  onChange={handleChange}
                  name="actual_end_date"
                  value={task.actual_end_date || ""} // якщо null, підставляється ""
                />
              </div>

              <div className="formInput">
                <label>{t("updatetask.statusLabel")}</label> {/* Ключ: "updatetask.statusLabel" */}
                <select
                  className="select"
                  name="status_id"
                  onChange={handleChange}
                  value={task.status_id}
                >
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.status_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="formInput">
                <label>{t("updatetask.priorityLabel")}</label> {/* Ключ: "updatetask.priorityLabel" */}
                <select
                  className="select"
                  name="priority_id"
                  onChange={handleChange}
                  value={task.priority_id}
                >
                  {priorities.map((priority) => (
                    <option key={priority.id} value={priority.id}>
                      {priority.priority_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="formInput">
                <label>{t("updatetask.ratingLabel")}</label> {/* Ключ: "updatetask.ratingLabel" */}
                <select
                  className="select"
                  name="rating"
                  onChange={handleChange}
                  value={task.rating}
                >
                  <option value="" disabled>
                    {t("updatetask.selectRatingOption")} {/* Ключ: "updatetask.selectRatingOption" */}
                  </option>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </div>
        </div>
        <div className="image-container">
          <div className="title">{t("updatetask.taskImagesTitle")}</div> {/* Ключ: "updatetask.taskImagesTitle" */}
          <div className="images">
            {images.map((image, index) => (
              <div key={index}>
                <RemoveCircleOutlineOutlinedIcon
                  className="icon"
                  onClick={() => handleDeleteImg(image.id)}
                />
                <Zoom>
                  <img
                    src={image.url}
                    alt={`${t("updatetask.image")} ${index + 1}`} // Ключ: "updatetask.image"
                    className="image"
                  />
                </Zoom>
              </div>
            ))}
          </div>
        </div>
        <div className="bottom">
          <div className="title">{t("updatetask.descriptionTitle")}</div> {/* Ключ: "updatetask.descriptionTitle" */}
          <div className="description">
            <div className="formInput">
              <ReactQuill
                value={task.description}
                onChange={handleEditorChange}
                modules={{
                  toolbar: [
                    [{ header: "1" }, { header: "2" }, { font: [] }],
                    [{ size: [] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [
                      { list: "ordered" },
                      { list: "bullet" },
                      { indent: "-1" },
                      { indent: "+1" },
                    ],
                    ["link", "image"],
                    ["clean"],
                  ],
                }}
                formats={[
                  "header",
                  "font",
                  "size",
                  "bold",
                  "italic",
                  "underline",
                  "strike",
                  "blockquote",
                  "list",
                  "bullet",
                  "indent",
                  "link",
                  "image",
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateTask;