import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./adduser.scss";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";

const hostUrl = "http://localhost:3001";

const AddUser = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    img: "", // поле для зребеження зображення користувача
    descr: "",
    role_id: "",
    job_id: "",
  });

  const filePicker = useRef(null);
  const [roles, setRoles] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null); // Оновлено
  const [uploaded, setUploaded] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get(`${hostUrl}/roles`);
        setRoles(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${hostUrl}/jobs`);
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
      const userRes = await axios.post(`${hostUrl}/users`, user);
      const userId = userRes.data.insertId; // Отримуємо ID нового користувача з відповіді сервера
      console.log(userId);
      // 2. Якщо вибрано файли, додаємо їх
      if (selectedFile) {
        const formData = new FormData();
        formData.append("files", selectedFile);
        formData.append("userId", userId); // Передаємо userId на сервер

        // В ПОСТАХ ТЕ ж САМЕ

        const res = await fetch(`${hostUrl}/upload_user`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        console.log("Uploaded files:", data.uploadedFiles);

        if (data.uploadedFiles) {
          setUploaded(data.uploadedFiles);
        }
      }

      // Після успішного додавання користувача та зображення перенаправляємо
      navigate("/admin/users");
    } catch (err) {
      console.error(err);
      alert("An error occurred while adding the user.");
    }
  };

  const handlePick = () => {
    filePicker.current.click();
  };

  return (
    <div className="adduser">
      <div className="adduserContainer">
        <div className="top">
          <p className="title">New user</p>
        </div>
        <div className="bottom">
          <div className="left">
            <div>
              <button className="buttonAddFile" onClick={handlePick}>Add file</button>
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
                src="https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                alt=""
              />
            )}

            {selectedFile && !uploaded && (
              <div className="selectedFile">
                <div>
                  <ul>
                    <li>Name: {selectedFile.name}</li>
                    <li>Type: {selectedFile.type}</li>
                    <li>Size: {selectedFile.size}</li>
                  </ul>
                </div>
                <div>
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
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
                  alt=""
                />
              </div>
            )}
          </div>

          <div className="right">
            <form>
              <div className="formInput">
                <label>Username</label>
                <input
                 className="input"
                  type="text"
                  placeholder="ПІБ нового виконавця"
                  onChange={handleChange}
                  name="name"
                />
              </div>

              <div className="formInput">
                <label>Email</label>
                <input
                  className="input"
                  type="text"
                  placeholder="email нового виконавця"
                  onChange={handleChange}
                  name="email"
                />
              </div>

              <div className="formInput">
                <label>Password</label>
                <input
                 className="input"
                  type="text"
                  placeholder="Пароль нового виконавця"
                  onChange={handleChange}
                  name="password"
                />
              </div>

              <div className="formInput">
                <label>Phone</label>
                <input
                 className="input"
                  type="text"
                  placeholder="номер телефону"
                  onChange={handleChange}
                  name="phone"
                />
              </div>

              <div className="formInput">
                <label>Description</label>
                <textarea
                  className="textarea"
                  type="text"
                  placeholder="опис"
                  onChange={handleChange}
                  name="descr"
                />
              </div>

              <div className="formInput">
                <label>Role</label>
                <select
                  className="select"
                  name="role_id"
                  onChange={handleChange}
                  value={user.role_id}
                >
                  <option value="" disabled>
                    Виберіть роль
                  </option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="formInput">
                <label>Jobs</label>
                <select
                  className="select"
                  name="job_id"
                  onChange={handleChange}
                  value={user.job_id}
                >
                  <option value="" disabled>
                    Виберіть посаду
                  </option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.name}
                    </option>
                  ))}
                </select>
              </div>
              <button className="button" onClick={handleClick}>
                Додати
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
