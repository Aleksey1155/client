import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import config from "../../config"
import Modal from "react-modal";
import "./userProfile.scss";

const customStyles = {
  content: {
    top: "350px",
    left: "40%",
    right: "700px",
    bottom: "-10%",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null); // стан для userId
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    email: "",
    name: "",
    phone: "",
    img: "",
    password: "",
    newPassword: "", // Дод newPassword
    confirmPassword: "", // Дод confirmPassword
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploaded, setUploaded] = useState();

  const navigate = useNavigate();
  const filePicker = useRef(null);

  // Запит для отримання даних користувача
  useEffect(() => {
    const fetchUserData = async () => {
      try {
       

        const response = await axiosInstance.get("/me");

        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Оновлення userId після завантаження userData
  useEffect(() => {
    if (userData && userData.id) {
      setUserId(userData.id); // Записуємо userId в окремий стан
    }
  }, [userData]);

  // Запит для отримання користувача за userId
  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          const res = await axiosInstance.get(`/users/${userId}`);
          setUser(res.data);
        } catch (err) {
          console.log(err);
        }
      };
      fetchUser();
    }
  }, [userId]); // Додаємо залежність від userId

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (user.newPassword !== user.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const updatedUser = { ...user };

    if (user.newPassword) {
      updatedUser.password = user.newPassword;
    }

    try {
      await axiosInstance.put(`/users/${userId}`, updatedUser);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("files", selectedFile);
    formData.append("userId", userId); // Передаємо userId на сервер

    const res = await fetch(`${config.baseURL}/upload_user`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploaded(data);
  };

  const handlePick = () => {
    filePicker.current.click();
  };

  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    subtitle.style.color = "#555";
  }

  function closeModal() {
    setIsOpen(false);
  }

  

  return (
    <div className="userProfile">
      <div className="containerUserProfile">
        <span onClick={openModal}>Profile</span>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          
          <span
            className="welcomeUserProfile"
            ref={(_subtitle) => (subtitle = _subtitle)}
          >
           {userData ? `Welcome, ${userData.name}!` : "Loading..."}
          </span>
          
          <div className="topContainerUserProfile">
            <button className="closeUserProfile" onClick={closeModal}>
              close
            </button>
            <span className="listTextUserProfile">Edit your Profile</span>
            <button className="editUserProfile" onClick={handleClick}>
              Редагувати
            </button>
          </div>

          <div className="updateUserProfile">
            <div className="topUserProfile">
              <p className="titleUserProfile">Update image</p>
            </div>
            <div className="bottomUserProfile">
              <div className="leftUserProfile">
                <div>
                  <button onClick={handlePick}>Add file</button>
                  <input
                    className="hiddenUserProfile"
                    ref={filePicker}
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*, .png, .jpg, .web"
                  />
                  <button onClick={handleUpload}>Upload now!</button>
                </div>

                {!selectedFile && (
                  <img className="noimageUserProfile" src={user.img} alt="" />
                )}

                {selectedFile && !uploaded && (
                  <div className="selectedFileUserProfile">
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
                        className="image-previewUserProfile"
                      />
                    </div>
                  </div>
                )}

                {uploaded && uploaded.uploadedFiles.length > 0 && (
                  <div>
                    <h2>{uploaded.uploadedFiles[0].fileName}</h2>
                    <img
                      className="imageUserProfile"
                      src={uploaded.uploadedFiles[0].filePath}
                      alt=""
                    />
                  </div>
                )}
              </div>
              <div className="rightUserProfile">
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
                    <label>New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      onChange={handleChange}
                      name="newPassword"
                      value={user.newPassword || ""} // Додаємо нову властивість у стан
                    />
                  </div>

                  <div className="formInput">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      onChange={handleChange}
                      name="confirmPassword"
                      value={user.confirmPassword || ""} // Додаємо нову властивість у стан
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default UserProfile;
