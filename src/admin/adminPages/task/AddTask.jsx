import React, { useState, useEffect, useRef, useContext } from "react";
import { ThemeContext } from "../../../ThemeContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../axiosInstance";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./addtask.scss";
import { useTranslation } from "react-i18next";

const AddTask = () => {
  const { darkMode } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [task, setTask] = useState({
    project_id: "",
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    priority_id: "",
    status_id: "",
  });

  const [statuses, setStatuses] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [projects, setProjects] = useState([]);
  const filePicker = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await axiosInstance.get(`/task_statuses`);
        setStatuses(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchPriorities = async () => {
      try {
        const res = await axiosInstance.get(`/task_priorities`);
        setPriorities(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchAllProjects = async () => {
      try {
        const res = await axiosInstance.get(`/projects`); // Запит на отримання всіх проєктів
        setProjects(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllProjects();
    fetchStatuses();
    fetchPriorities();
  }, []);

  const handleChange = (e) => {
    setTask((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditorChange = (content) => {
    setTask((prev) => ({ ...prev, description: content }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files); // Зберігаємо файли у стані
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const taskRes = await axiosInstance.post("/tasks", task);
      const taskId = taskRes.data.insertId;

      if (selectedFiles.length > 0 && taskId) {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append("files", file);
        });
        formData.append("task_id", taskId);

        await axiosInstance.post("/upload_task", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      navigate("/admin/tasks");
    } catch (err) {
      console.error("Error adding task:", err);
      alert(t("addtask.addTaskErrorAlert")); // Ключ: "addtask.addTaskErrorAlert"
    }
  };

  const handlePick = () => {
    filePicker.current.click();
  };

  return (
    <div className="addtask">
      <div className="addtaskContainer">
        <div className="top">
          <p className="title">{t("addtask.newTaskTitle")}</p> {/* Ключ: "addtask.newTaskTitle" */}
          <button className="button" onClick={handleClick}>
            {t("addtask.addButton")} {/* Ключ: "addtask.addButton" */}
          </button>
        </div>
        <div className="center">
          <div className="left">
            <div>
              <button className="buttonAddFile" onClick={handlePick}>
                {t("addtask.addFileButton")} {/* Ключ: "addtask.addFileButton" */}
              </button>
              <input
                className="hidden"
                ref={filePicker}
                multiple
                type="file"
                onChange={handleFileChange}
                accept="image/*, .png, .jpg, .web"
              />
            </div>

            {selectedFiles.length === 0 && (
              <img
                className="noimage"
                src={
                  darkMode
                    ? "/images/no-image-icon-dark.jpg"
                    : "/images/no-image-icon-light.jpg"
                }
                alt={t("addtask.noImageAlt")} // Ключ: "addtask.noImageAlt"
              />
            )}

            {selectedFiles.length > 0 && (
              <div className="selectedFiles">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="selectedFile">
                    <ul>
                      <li>{t("addtask.fileName")}: {file.name.slice(-15)}</li> {/* Ключ: "addtask.fileName" */}
                      <li>{t("addtask.fileSize")}: {(file.size / 1024).toFixed(2)} KB</li> {/* Ключ: "addtask.fileSize" */}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label>{t("addtask.taskTitleLabel")}</label> {/* Ключ: "addtask.taskTitleLabel" */}
                <input
                  className="input"
                  type="text"
                  placeholder={t("addtask.taskTitlePlaceholder")} // Ключ: "addtask.taskTitlePlaceholder"
                  onChange={handleChange}
                  name="title"
                />
              </div>
              <div className="formInput">
                <label>{t("addtask.projectLabel")}</label> {/* Ключ: "addtask.projectLabel" */}
                <select
                  className="select"
                  name="project_id"
                  onChange={handleChange}
                  value={task.project_id}
                >
                  <option value="" disabled>
                    {t("addtask.selectProjectOption")} {/* Ключ: "addtask.selectProjectOption" */}
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
                <label>{t("addtask.startDateLabel")}</label> {/* Ключ: "addtask.startDateLabel" */}
                <input
                  className="inputDate"
                  type="date"
                  placeholder={t("addtask.startDatePlaceholder")} // Ключ: "addtask.startDatePlaceholder"
                  onChange={handleChange}
                  name="start_date"
                />
              </div>
              <div
                className="formInput"
                onClick={(e) =>
                  e.currentTarget.querySelector("input").showPicker()
                }
              >
                <label>{t("addtask.endDateLabel")}</label> {/* Ключ: "addtask.endDateLabel" */}
                <input
                  className="inputDate"
                  type="date"
                  placeholder={t("addtask.endDatePlaceholder")} // Ключ: "addtask.endDatePlaceholder"
                  onChange={handleChange}
                  name="end_date"
                />
              </div>

              <div className="formInput">
                <label>{t("addtask.statusLabel")}</label> {/* Ключ: "addtask.statusLabel" */}
                <select
                  className="select"
                  name="status_id"
                  onChange={handleChange}
                  value={task.status_id}
                >
                  <option value="" disabled>
                    {t("addtask.selectStatusOption")} {/* Ключ: "addtask.selectStatusOption" */}
                  </option>
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.status_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="formInput">
                <label>{t("addtask.priorityLabel")}</label> {/* Ключ: "addtask.priorityLabel" */}
                <select
                  className="select"
                  name="priority_id"
                  onChange={handleChange}
                  value={task.priority_id}
                >
                  <option value="" disabled>
                    {t("addtask.selectPriorityOption")} {/* Ключ: "addtask.selectPriorityOption" */}
                  </option>

                  {priorities.map((priority) => (
                    <option key={priority.id} value={priority.id}>
                      {priority.priority_name}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </div>
        </div>
        <div className="image-container">
          <div className="title">{t("addtask.projectImagesTitle")}</div> {/* Ключ: "addtask.projectImagesTitle" */}
          <div className="images">
            {selectedFiles.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`${t("addtask.preview")} ${index}`} // Ключ: "addtask.preview"
                className="image-preview"
              />
            ))}
          </div>
        </div>

        <div className="bottom">
          <div className="title">{t("addtask.descriptionTitle")}</div> {/* Ключ: "addtask.descriptionTitle" */}

          <div className="description">
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
  );
};

export default AddTask;