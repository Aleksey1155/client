import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axiosInstance from "../../../axiosInstance";
import config from "../../../config";
import axios from "axios";
import "./updateuser.scss";

const hostUrl = "http://localhost:3001";

const UpdateUser = () => {
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
  // const location = useLocation();
  // const userId = location.pathname.split("/")[2];

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

  //*********************************************************** */

  const handleUpload = async () => {
  if (!selectedFile) {
    alert("Please select a file");
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
  }
};

  // const handleUpload = async () => {
  //   if (!selectedFile) {
  //     alert("Please select a file");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("files", selectedFile);
  //   formData.append("userId", userId); // Передаємо userId на сервер

  //   const res = await fetch(`${hostUrl}/upload_user`, {
  //     method: "POST",
  //     body: formData,
  //   });

  //   console.log("Selected File: ", selectedFile);

  //   const data = await res.json();
  //   setUploaded(data);
  //   // // Затримка на 1 секунду перед оновленням сторінки
  //   // setTimeout(() => {
  //   //   navigate(0); // Перенаправляємо на ту ж сторінку для оновлення
  //   // }, 1000); // 1000 мс = 1 секунда
  // };
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  const handlePick = () => {
    filePicker.current.click();
  };

  return (
    <div className="updateuser">
      <div className="updateuserContainer">
        <div className="top">
          <p className="title">Update user</p>
          <button className="nav-addlink" onClick={handleClick}>
            Редагувати
          </button>
        </div>
        <div className="bottom">
          <div className="left">
            <div>
              <button onClick={handlePick}>Add file</button>
              <input
                className="hidden"
                ref={filePicker}
                type="file"
                onChange={handleFileChange}
                accept="image/*, .png, .jpg, .web"
              />
              <button onClick={handleUpload}>Upload now!</button>
            </div>

            {!selectedFile && <img className="noimage" src={user.img} alt="" />}

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

            {/* ------------------------ Для Cloudinary ------------------- */}

            {/* {uploaded &&
              uploaded.uploadedFiles &&
              uploaded.uploadedFiles.length > 0 && (
                <div>
                  <h2>{uploaded.uploadedFiles[0].fileName}</h2>
                  <img
                    className="image"
                    src={uploaded.uploadedFiles[0].filePath}
                    alt=""
                  />
                </div>
              )} */}
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="name"
                  onChange={handleChange}
                  name="name"
                  value={user.name}
                />
              </div>

              <div className="formInput">
                <label>Email</label>
                <input
                  type="text"
                  placeholder="email"
                  onChange={handleChange}
                  name="email"
                  value={user.email}
                />
              </div>

              <div className="formInput">
                <label>Phone</label>
                <input
                  type="text"
                  placeholder="phone"
                  onChange={handleChange}
                  name="phone"
                  value={user.phone}
                />
              </div>

              <div className="formInput">
                <label>Description</label>
                <textarea
                  type="text"
                  placeholder="опис"
                  onChange={handleChange}
                  name="descr"
                  value={user.descr}
                />
              </div>
              <div className="formInput">
                <label>Photo</label>
                <input
                  type="text"
                  placeholder="photo"
                  onChange={handleChange}
                  name="img"
                  value={user.img}
                />
              </div>
              <div className="formInput">
                <label>Roles</label>
                <select
                  name="role_id"
                  onChange={handleChange}
                  value={user.role_id}
                >
                  <option value="" disabled>
                    Виберіть посаду
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
