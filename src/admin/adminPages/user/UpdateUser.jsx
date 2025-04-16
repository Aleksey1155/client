import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../axiosInstance";
import config from "../../../config";
import { useTranslation } from "react-i18next";

import "./updateuser.scss";

const UpdateUser = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState({
    email: "",
    name: "",
    phone: "",
    img: "",
    descr: "",
    role_id: "",
    job_id: "",
  });

  const [roles, setRoles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploaded, setUploaded] = useState();
  const [jobs, setJobs] = useState([]);

  const filePicker = useRef(null);

  const navigate = useNavigate();
  const { id: userId } = useParams();

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

    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/users/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchJobs();
    fetchRoles();
    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/users/${userId}`, user);
      navigate(`/admin/users/${userId}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFileChange = (event) => {
    console.log(event.target.files); //--------------------------------
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert(t("updateuser.selectFileAlert")); // Ключ: "updateuser.selectFileAlert"
      return;
    }

    const formData = new FormData();
    formData.append("files", selectedFile);
    formData.append("userId", userId); // Передаємо userId на сервер

    try {
      const res = await fetch(`${config.baseURL}/upload_user`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Server Response:", data); // Додано для перевірки

      setUploaded(data);
      window.location.reload();
    } catch (error) {
      console.error("Upload error:", error);
      alert(t("updateuser.uploadErrorAlert")); // Ключ: "updateuser.uploadErrorAlert"
    }
  };

  const handlePick = () => {
    filePicker.current.click();
  };

  return (
    <div className="updateuser">
      <div className="updateuserContainer">
        <div className="top">
          <p className="title">{t("updateuser.title")}</p> {/* Ключ: "updateuser.title" */}
          <button className="buttonUpdateUser" onClick={handleClick}>
            {t("updateuser.editButton")} {/* Ключ: "updateuser.editButton" */}
          </button>
        </div>
        <div className="bottom">
          <div className="left">
            <div>
              <button className="buttonAddFile" onClick={handlePick}>
                {t("updateuser.addFileButton")} {/* Ключ: "updateuser.addFileButton" */}
              </button>
              <input
                className="hidden"
                ref={filePicker}
                type="file"
                onChange={handleFileChange}
                accept="image/*, .png, .jpg, .web"
              />
              <button className="buttonAddFile" onClick={handleUpload}>
                {t("updateuser.uploadNowButton")} {/* Ключ: "updateuser.uploadNowButton" */}
              </button>
            </div>

            {!selectedFile && (
              <img className="noimage" src={user.img} alt={t("updateuser.noImageAlt")} /> /* Ключ: "updateuser.noImageAlt" */
            )}

            {selectedFile && !uploaded && (
              <div className="selectedFile">
                <div>
                  <ul>
                    <li>{t("updateuser.fileName")}: {selectedFile.name}</li> {/* Ключ: "updateuser.fileName" */}
                    <li>{t("updateuser.fileType")}: {selectedFile.type}</li> {/* Ключ: "updateuser.fileType" */}
                    <li>{t("updateuser.fileSize")}: {selectedFile.size}</li> {/* Ключ: "updateuser.fileSize" */}
                  </ul>
                </div>
                <div>
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt={t("updateuser.previewAlt")} // Ключ: "updateuser.previewAlt"
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
                  alt={t("updateuser.uploadedImageAlt")} // Ключ: "updateuser.uploadedImageAlt"
                />
              </div>
            )}
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label>{t("updateuser.usernameLabel")}</label> {/* Ключ: "updateuser.usernameLabel" */}
                <input
                  className="input"
                  type="text"
                  placeholder={t("updateuser.usernamePlaceholder")} // Ключ: "updateuser.usernamePlaceholder"
                  onChange={handleChange}
                  name="name"
                  value={user.name}
                />
              </div>

              <div className="formInput">
                <label>{t("updateuser.emailLabel")}</label> {/* Ключ: "updateuser.emailLabel" */}
                <input
                  className="input"
                  type="text"
                  placeholder={t("updateuser.emailPlaceholder")} // Ключ: "updateuser.emailPlaceholder"
                  onChange={handleChange}
                  name="email"
                  value={user.email}
                />
              </div>

              <div className="formInput">
                <label>{t("updateuser.phoneLabel")}</label> {/* Ключ: "updateuser.phoneLabel" */}
                <input
                  className="input"
                  type="text"
                  placeholder={t("updateuser.phonePlaceholder")} // Ключ: "updateuser.phonePlaceholder"
                  onChange={handleChange}
                  name="phone"
                  value={user.phone}
                />
              </div>

              <div className="formInput">
                <label>{t("updateuser.descriptionLabel")}</label> {/* Ключ: "updateuser.descriptionLabel" */}
                <textarea
                  className="textarea"
                  type="text"
                  placeholder={t("updateuser.descriptionPlaceholder")} // Ключ: "updateuser.descriptionPlaceholder"
                  onChange={handleChange}
                  name="descr"
                  value={user.descr}
                />
              </div>
              <div className="formInput">
                <label>{t("updateuser.photoLabel")}</label> {/* Ключ: "updateuser.photoLabel" */}
                <input
                  className="input"
                  type="text"
                  placeholder={t("updateuser.photoPlaceholder")} // Ключ: "updateuser.photoPlaceholder"
                  onChange={handleChange}
                  name="img"
                  value={user.img}
                />
              </div>
              <div className="formInput">
                <label>{t("updateuser.rolesLabel")}</label> {/* Ключ: "updateuser.rolesLabel" */}
                <select
                  className="select"
                  name="role_id"
                  onChange={handleChange}
                  value={user.role_id}
                >
                  <option value="" disabled>
                    {t("updateuser.selectRole")} {/* Ключ: "updateuser.selectRole" */}
                  </option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="formInput">
                <label>{t("updateuser.jobsLabel")}</label> {/* Ключ: "updateuser.jobsLabel" */}
                <select
                  className="select"
                  name="job_id"
                  onChange={handleChange}
                  value={user.job_id}
                >
                  <option value="" disabled>
                    {t("updateuser.selectJob")} {/* Ключ: "updateuser.selectJob" */}
                  </option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.name}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;