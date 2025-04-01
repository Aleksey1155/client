import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../axiosInstance";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./addproject.scss";



const AddProject = () => {
  const [project, setProject] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    status_id: "",
  });

  const filePicker = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await axiosInstance.get(`/project_statuses`);
        setStatuses(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchStatuses();
  }, []);

  const handleChange = (e) => {
    setProject((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditorChange = (content) => {
    setProject((prev) => ({ ...prev, description: content }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files); // Зберігаємо файли у стані
  };

  const handleClick = async (e) => {
    e.preventDefault();
    
    try {
      // 1. Додаємо проект
      const projectRes = await axiosInstance.post(`/projects`, project);
      const projectId = projectRes.data.insertId; // Отримуємо з серверу id нового проекту
    
      // 2. Якщо вибрано файли, додаємо їх до таблиці project_images
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append("files", file);
        });
    
        formData.append("project_id", projectId);
    
        await axiosInstance.post(`/upload_project`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
    
      // Після успішного додавання проекту та зображень перенаправляємо користувача
      navigate("/admin/projects");
    } catch (err) {
      console.error(err); // Логування помилки
      alert('An error occurred while adding the project.'); // Повідомлення користувача
    }
  };
  
  

  const handlePick = () => {
    filePicker.current.click();
  };

  return (
    <div className="addproject">
      <div className="addprojectContainer">
        <div className="top">
          <p className="title">New project</p>
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
                <label>Project title</label>
                <input
                  type="text"
                  placeholder="Назва нового проекту"
                  onChange={handleChange}
                  name="title"
                />
              </div>

              <div className="formInput"></div>

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
                  value={project.status_id}
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
              value={project.description}
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

export default AddProject;
