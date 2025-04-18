import React, { useState, useEffect, useRef, useContext } from "react";
import { ThemeContext } from "../../../ThemeContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../axiosInstance";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./addproject.scss";
import { useTranslation } from "react-i18next";

const AddProject = () => {
  const { darkMode } = useContext(ThemeContext);
  const { t } = useTranslation();
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
    const file = e.target.files[0];
    if (!file) return;
  
    // Перевірка на кирилицю
    const hasCyrillic = /[а-яА-ЯіїєґЁё]/.test(file.name);
    if (hasCyrillic) {
      alert("Назва файлу не повинна містити кирилицю. Перейменуйте файл латинськими літерами.");
      return;
    }
  
    setSelectedFiles(file);
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
      alert(t("addproject.error")); // Повідомлення користувача
    }
  };

  const handlePick = () => {
    filePicker.current.click();
  };

  return (
    <div className="addproject">
      <div className="addprojectContainer">
        <div className="top">
          <p className="title">{t("addproject.title")}</p> {/* Ключ: "addproject.title" */}
          <button className="button" onClick={handleClick}>
            {t("addproject.addButton")} {/* Ключ: "addproject.addButton" */}
          </button>
        </div>
        <div className="center">
          <div className="left">
            <div>
              <button className="buttonAddFile" onClick={handlePick}>
                {t("addproject.addFileButton")} {/* Ключ: "addproject.addFileButton" */}
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
                alt={t("addproject.noImageAlt")} // Ключ: "addproject.noImageAlt"
              />
            )}

            {selectedFiles.length > 0 && (
              <div className="selectedFiles">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="selectedFile">
                    <ul>
                      <li>{t("addproject.fileName")}: {file.name.slice(-15)}</li> {/* Ключ: "addproject.fileName" */}
                      <li>{t("addproject.fileSize")}: {(file.size / 1024).toFixed(2)} KB</li> {/* Ключ: "addproject.fileSize" */}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label>{t("addproject.projectTitleLabel")}</label> {/* Ключ: "addproject.projectTitleLabel" */}
                <input
                  className="input"
                  type="text"
                  placeholder={t("addproject.projectTitlePlaceholder")} // Ключ: "addproject.projectTitlePlaceholder"
                  onChange={handleChange}
                  name="title"
                />
              </div>

              <div className="formInput"></div>

              <div className="formInput" onClick={(e) => e.currentTarget.querySelector("input").showPicker()}>
                <label>{t("addproject.startDateLabel")}</label> {/* Ключ: "addproject.startDateLabel" */}
                <input
                  className="inputDate"
                  type="date"
                  placeholder={t("addproject.startDatePlaceholder")} // Ключ: "addproject.startDatePlaceholder"
                  onChange={handleChange}
                  name="start_date"
                />
              </div>
              <div className="formInput" onClick={(e) => e.currentTarget.querySelector("input").showPicker()}>
                <label>{t("addproject.endDateLabel")}</label> {/* Ключ: "addproject.endDateLabel" */}
                <input
                  className="inputDate"
                  type="date"
                  placeholder={t("addproject.endDatePlaceholder")} // Ключ: "addproject.endDatePlaceholder"
                  onChange={handleChange}
                  name="end_date"
                />
              </div>

              <div className="formInput">
                <label>{t("addproject.statusLabel")}</label> {/* Ключ: "addproject.statusLabel" */}
                <select
                  className="select"
                  name="status_id"
                  onChange={handleChange}
                  value={project.status_id}
                >
                  <option value="" disabled>
                    {t("addproject.selectStatus")} {/* Ключ: "addproject.selectStatus" */}
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
          <div className="title">{t("addproject.projectImagesTitle")}</div> {/* Ключ: "addproject.projectImagesTitle" */}
          <div className="images">
            {selectedFiles.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`${t("addproject.preview")} ${index}`} // Ключ: "addproject.preview"
                className="image-preview"
              />
            ))}
          </div>
        </div>

        <div className="bottom">
          <div className="title">{t("addproject.descriptionTitle")}</div> {/* Ключ: "addproject.descriptionTitle" */}

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