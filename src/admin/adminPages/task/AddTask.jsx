import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./addtask.scss";

const hostUrl = "http://localhost:3001";

const AddTask = () => {
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
        const res = await axios.get(`${hostUrl}/task_statuses`);
        setStatuses(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchPriorities = async () => {
      try {
        const res = await axios.get(`${hostUrl}/task_priorities`);
        setPriorities(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchAllProjects = async () => {
      try {
        const res = await axios.get("http://localhost:3001/projects"); // Запит на отримання всіх проєктів
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
      // 1. Додаємо завдання
      const taskRes = await axios.post(`${hostUrl}/tasks`, task);
      const taskId = taskRes.data.insertId; // Отримуємо id нового завдання

      console.log("Created Task ID:", taskId); // Логування taskId

      // 2. Якщо вибрано файли, додаємо їх до таблиці task_images
      if (selectedFiles.length > 0 && taskId) {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append("files", file);
        });
        formData.append("task_id", taskId); // Додаємо task_id

        await axios.post(`${hostUrl}/upload_task`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // Перенаправляємо користувача після успішного додавання завдання та файлів
      navigate("/admin/tasks");
    } catch (err) {
      console.error("Error adding task:", err); // Логування помилки
      alert("An error occurred while adding the task."); // Повідомлення користувача
    }
  };

  const handlePick = () => {
    filePicker.current.click();
  };
  
  return (
    <div className="addtask">
      <div className="addtaskContainer">
        <div className="top">
          <p className="title">New task</p>
          <button className="nav-addlink" onClick={handleClick}>
            Додати
          </button>
        </div>
        <div className="center">
          <div className="left">
            <div>
              <button onClick={handlePick}>Add file</button>
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
                src="https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                alt="No images"
              />
            )}

            {selectedFiles.length > 0 && (
              <div className="selectedFiles">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="selectedFile">
                    <ul>
                      <li>Name: {file.name.slice(-15)}</li>
                      <li>Size: {(file.size / 1024).toFixed(2)} KB</li>
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="right">
            <form>
            <div className="formInput">
                <label>Task title</label>
                <input
                  type="text"
                  placeholder="Назва нового завдання"
                  onChange={handleChange}
                  name="title"
                />
              </div>
              <div className="formInput">
                <label>Project</label>
                <select
                  name="project_id"
                  onChange={handleChange}
                  value={task.project_id}
                >
                  <option value="" disabled>
                    Виберіть проект
                  </option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title} 
                    </option>
                  ))}
                </select>
              </div>
              <div className="formInput">
                <label>Start Date</label>
                <input
                  type="date"
                  placeholder="start_date"
                  onChange={handleChange}
                  name="start_date"
                />
              </div>
              <div className="formInput">
                <label>End Date</label>
                <input
                  type="date"
                  placeholder="end_date"
                  onChange={handleChange}
                  name="end_date"
                />
              </div>

              <div className="formInput">
                <label>Status</label>
                <select
                  name="status_id"
                  onChange={handleChange}
                  value={task.status_id}
                >
                  <option value="" disabled>
                    Виберіть статус
                  </option>
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.status_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="formInput">
                <label>Priority</label>
                <select
                  name="priority_id"
                  onChange={handleChange}
                  value={task.priority_id}
                >
                  <option value="" disabled>
                    Виберіть приоритет
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
          <div className="title">Project Images</div>
          <div className="images">
            {selectedFiles.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`Preview ${index}`}
                className="image-preview"
              />
            ))}
          </div>
        </div>

        <div className="bottom">
          <div className="title">Description</div>

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
