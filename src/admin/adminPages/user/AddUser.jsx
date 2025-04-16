import React, { useState, useEffect, useRef, useContext } from "react";
import { ThemeContext } from "../../../ThemeContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../axiosInstance";
import "./adduser.scss";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import { useTranslation } from "react-i18next";

const AddUser = () => {
  const { darkMode } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [user, setUser] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    img: "",
    descr: "",
    role_id: "",
    job_id: "",
  });

  const filePicker = useRef(null);
  const [roles, setRoles] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploaded, setUploaded] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axiosInstance.get("/roles");
        setRoles(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchJobs = async () => {
      try {
        const res = await axiosInstance.get("/jobs");
        setJobs(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRoles();
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      // 1. Додаємо користувача
      const userRes = await axiosInstance.post("/users", user);
      const userId = userRes.data.insertId;

      // 2. Якщо вибрано файл, завантажуємо його
      if (selectedFile) {
        const formData = new FormData();
        formData.append("files", selectedFile);
        formData.append("userId", userId);

        const uploadRes = await axiosInstance.post("/upload_user", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const data = uploadRes.data;
        if (data.uploadedFiles) {
          setUploaded(data.uploadedFiles);
        }
      }

      // Перенаправлення після завершення
      navigate("/admin/users");
    } catch (err) {
      console.error(err);
      alert(t("adduser.error")); // Додайте ключ "adduser.error" у ваші файли перекладів
    }
  };

  const handlePick = () => {
    filePicker.current.click();
  };

  return (
    <div className="adduser">
      <div className="adduserContainer">
        <div className="top">
          <p className="title">{t("adduser.title")}</p> {/* Ключ: "adduser.title" */}
        </div>
        <div className="bottom">
          <div className="left">
            <div>
              <button className="buttonAddFile" onClick={handlePick}>
                {t("adduser.addFile")} {/* Ключ: "adduser.addFile" */}
              </button>
              <input
                className="hidden"
                ref={filePicker}
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>

            {!selectedFile && (
              <img
                className="noimage"
                src={
                  darkMode
                    ? "/images/no-image-icon-dark.jpg"
                    : "/images/no-image-icon-light.jpg"
                }
                alt={t("adduser.noImageAlt")} // Ключ: "adduser.noImageAlt"
              />
            )}

            {selectedFile && !uploaded && (
              <div className="selectedFile">
                <div>
                  <ul>
                    <li>{t("adduser.fileName")}: {selectedFile.name}</li> {/* Ключ: "adduser.fileName" */}
                    <li>{t("adduser.fileType")}: {selectedFile.type}</li> {/* Ключ: "adduser.fileType" */}
                    <li>{t("adduser.fileSize")}: {selectedFile.size}</li> {/* Ключ: "adduser.fileSize" */}
                  </ul>
                </div>
                <div>
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt={t("adduser.previewAlt")} // Ключ: "adduser.previewAlt"
                    className="image-preview"
                  />
                </div>
              </div>
            )}

            {uploaded && uploaded.uploadedFiles.length > 0 && (
              <div>
                <h2>{uploaded.uploadedFiles[0].fileName}</h2>
                <img
                  className="image"
                  src={uploaded.uploadedFiles[0].filePath}
                  alt={t("adduser.uploadedImageAlt")} // Ключ: "adduser.uploadedImageAlt"
                />
              </div>
            )}
          </div>

          <div className="right">
            <form>
              <div className="formInput">
                <label>{t("adduser.usernameLabel")}</label> {/* Ключ: "adduser.usernameLabel" */}
                <input
                  className="input"
                  type="text"
                  placeholder={t("adduser.usernamePlaceholder")} // Ключ: "adduser.usernamePlaceholder"
                  onChange={handleChange}
                  name="name"
                />
              </div>

              <div className="formInput">
                <label>{t("adduser.emailLabel")}</label> {/* Ключ: "adduser.emailLabel" */}
                <input
                  className="input"
                  type="text"
                  placeholder={t("adduser.emailPlaceholder")} // Ключ: "adduser.emailPlaceholder"
                  onChange={handleChange}
                  name="email"
                />
              </div>

              <div className="formInput">
                <label>{t("adduser.passwordLabel")}</label> {/* Ключ: "adduser.passwordLabel" */}
                <input
                  className="input"
                  type="text"
                  placeholder={t("adduser.passwordPlaceholder")} // Ключ: "adduser.passwordPlaceholder"
                  onChange={handleChange}
                  name="password"
                />
              </div>

              <div className="formInput">
                <label>{t("adduser.phoneLabel")}</label> {/* Ключ: "adduser.phoneLabel" */}
                <input
                  className="input"
                  type="text"
                  placeholder={t("adduser.phonePlaceholder")} // Ключ: "adduser.phonePlaceholder"
                  onChange={handleChange}
                  name="phone"
                />
              </div>

              <div className="formInput">
                <label>{t("adduser.descriptionLabel")}</label> {/* Ключ: "adduser.descriptionLabel" */}
                <textarea
                  className="textarea"
                  placeholder={t("adduser.descriptionPlaceholder")} // Ключ: "adduser.descriptionPlaceholder"
                  onChange={handleChange}
                  name="descr"
                />
              </div>

              <div className="formInput">
                <label>{t("adduser.roleLabel")}</label> {/* Ключ: "adduser.roleLabel" */}
                <select
                  className="select"
                  name="role_id"
                  onChange={handleChange}
                  value={user.role_id}
                >
                  <option value="" disabled>
                    {t("adduser.selectRole")} {/* Ключ: "adduser.selectRole" */}
                  </option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formInput">
                <label>{t("adduser.jobsLabel")}</label> {/* Ключ: "adduser.jobsLabel" */}
                <select
                  className="select"
                  name="job_id"
                  onChange={handleChange}
                  value={user.job_id}
                >
                  <option value="" disabled>
                    {t("adduser.selectJob")} {/* Ключ: "adduser.selectJob" */}
                  </option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.name}
                    </option>
                  ))}
                </select>
              </div>

              <button className="buttonAddUser" onClick={handleClick}>
                {t("adduser.addUserButton")} {/* Ключ: "adduser.addUserButton" */}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;