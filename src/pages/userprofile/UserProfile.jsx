import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../axiosInstance";
import config from "../../config";
import Modal from "react-modal";
import "./userProfile.scss";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    width: "800px",
    height: "600px",
    backgroundColor: "var(--block-bg) !important", // Темний фон
    color: "var(--header-tex) !important", // Білий текст
    border: "1px solid #444", // Темна рамка
    borderRadius: "10px",
    padding: "20px",
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)", // Темний прозорий фон
    zIndex: 1000,
  },
};

Modal.setAppElement("#root");

function UserProfile() {
  const { t } = useTranslation();
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
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  // Запит для отримання даних користувача
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/me");
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error(t("userProfile.fetchUserDataError"), error); // Ключ: "userProfile.fetchUserDataError"
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, t]);

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
          console.error(t("userProfile.fetchUserError"), err); // Ключ: "userProfile.fetchUserError"
        }
      };
      fetchUser();
    }
  }, [userId, t]); // Додаємо залежність від userId

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!user.newPassword) {
      alert(t("userProfile.enterPasswordAlert")); // Ключ: "userProfile.enterPasswordAlert"
      return;
    }

    if (user.newPassword !== user.confirmPassword) {
      alert(t("userProfile.passwordMismatchAlert")); // Ключ: "userProfile.passwordMismatchAlert"
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
      console.error(t("userProfile.updateError"), err); // Ключ: "userProfile.updateError"
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert(t("userProfile.selectFileAlert")); // Ключ: "userProfile.selectFileAlert"
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
      setUploaded(data);
      window.location.reload();
    } catch (error) {
      console.error(t("userProfile.uploadError"), error); // Ключ: "userProfile.uploadError"
    }
  };

  const handlePick = () => {
    filePicker.current.click();
  };

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
    <div>
      <span onClick={openModal}>{t("userProfile.profile")}</span> {/* Ключ: "userProfile.profile" */}
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel={t("userProfile.modalLabel")} // Ключ: "userProfile.modalLabel"
      >
        <div className="userProfile">
          <div className="containerUserProfile">
            <span
              className="welcomeUserProfile"
              ref={(_subtitle) => (subtitle = _subtitle)}
            >
              {userData
                ? t("userProfile.welcome", { name: userData.name }) // Ключ: "userProfile.welcome"
                : t("userProfile.loading")} 
            </span>

            <div className="topContainerUserProfile">
              <button className="closeUserProfile" onClick={closeModal}>
                {t("userProfile.close")} {/* Ключ: "userProfile.close" */}
              </button>
              <span className="listTextUserProfile">
                {t("userProfile.editProfile")} {/* Ключ: "userProfile.editProfile" */}
              </span>
              <button className="editUserProfile" onClick={handleClick}>
                {t("userProfile.editButton")} {/* Ключ: "userProfile.editButton" */}
              </button>
            </div>

            <div className="updateUserProfile">
              <div className="topUserProfile">
                <p className="titleUserProfile">
                  {t("userProfile.updateImage")} {/* Ключ: "userProfile.updateImage" */}
                </p>
              </div>
              <div className="bottomUserProfile">
                <div className="leftUserProfile">
                  <div>
                    <button className="buttonAddFile" onClick={handlePick}>
                      {t("userProfile.addFile")} {/* Ключ: "userProfile.addFile" */}
                    </button>
                    <input
                      className="hiddenUserProfile"
                      ref={filePicker}
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*, .png, .jpg, .web"
                    />
                    <button className="buttonAddFile" onClick={handleUpload}>
                      {t("userProfile.uploadNow")} {/* Ключ: "userProfile.uploadNow" */}
                    </button>
                  </div>

                  {!selectedFile && (
                    <img
                      className="noimageUserProfile"
                      src={user.img}
                      alt={t("userProfile.profileImage")} // Ключ: "userProfile.profileImage"
                    />
                  )}

                  {selectedFile && !uploaded && (
                    <div className="selectedFileUserProfile">
                      <div>
                        <ul>
                          <li>
                            {t("userProfile.fileName")}: {selectedFile.name} {/* Ключ: "userProfile.fileName" */}
                          </li>
                          <li>
                            {t("userProfile.fileType")}: {selectedFile.type} {/* Ключ: "userProfile.fileType" */}
                          </li>
                          <li>
                            {t("userProfile.fileSize")}: {selectedFile.size} {/* Ключ: "userProfile.fileSize" */}
                          </li>
                        </ul>
                      </div>
                      <div>
                        <img
                          src={URL.createObjectURL(selectedFile)}
                          alt={t("userProfile.preview")} // Ключ: "userProfile.preview"
                          className="image-previewUserProfile"
                        />
                      </div>
                    </div>
                  )}

                  {uploaded?.uploadedFiles?.length > 0 && (
                    <div>
                      <h2>{uploaded.uploadedFiles[0].fileName}</h2>
                      <img
                        className="imageUserProfile"
                        src={uploaded.uploadedFiles[0].filePath}
                        alt={uploaded.uploadedFiles[0].fileName}
                      />
                    </div>
                  )}
                </div>
                <div className="rightUserProfile">
                  <form className="formUserProfile">
                    <div className="formInputUserProfile">
                      <label>{t("userProfile.usernameLabel")}</label> {/* Ключ: "userProfile.usernameLabel" */}
                      <input
                        className="input"
                        type="text"
                        placeholder={t("userProfile.usernamePlaceholder")} // Ключ: "userProfile.usernamePlaceholder"
                        onChange={handleChange}
                        name="name"
                        value={user.name}
                      />
                    </div>

                    <div className="formInputUserProfile">
                      <label>{t("userProfile.emailLabel")}</label> {/* Ключ: "userProfile.emailLabel" */}
                      <input
                        className="input"
                        type="text"
                        placeholder={t("userProfile.emailPlaceholder")} // Ключ: "userProfile.emailPlaceholder"
                        onChange={handleChange}
                        name="email"
                        value={user.email}
                      />
                    </div>

                    <div className="formInputUserProfile">
                      <label>{t("userProfile.phoneLabel")}</label> {/* Ключ: "userProfile.phoneLabel" */}
                      <input
                        className="input"
                        type="text"
                        placeholder={t("userProfile.phonePlaceholder")} // Ключ: "userProfile.phonePlaceholder"
                        onChange={handleChange}
                        name="phone"
                        value={user.phone}
                      />
                    </div>

                    <div className="formInputUserProfile">
                      <label>{t("userProfile.newPasswordLabel")}</label> {/* Ключ: "userProfile.newPasswordLabel" */}
                      <input
                        className="input"
                        type="password"
                        placeholder={t("userProfile.newPasswordPlaceholder")} // Ключ: "userProfile.newPasswordPlaceholder"
                        onChange={handleChange}
                        name="newPassword"
                        value={user.newPassword || ""} // Додаємо нову властивість у стан
                      />
                    </div>

                    <div className="formInputUserProfile">
                      <label>{t("userProfile.confirmPasswordLabel")}</label> {/* Ключ: "userProfile.confirmPasswordLabel" */}
                      <input
                        className="input"
                        type="password"
                        placeholder={t("userProfile.confirmPasswordPlaceholder")} // Ключ: "userProfile.confirmPasswordPlaceholder"
                        onChange={handleChange}
                        name="confirmPassword"
                        value={user.confirmPassword || ""} // Додаємо нову властивість у стан
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default UserProfile;