import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../ThemeContext"; // шлях до ThemeContext
import axiosInstance from "../../axiosInstance";
import config from "../../config";
import Modal from "react-modal";
import "./addStory.scss";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
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

const formatDateForMySQL = (date) => {
  return date.toISOString().slice(0, 19).replace("T", " ");
};

function AddStory({ userData }) {
  const { t } = useTranslation();
  const { darkMode } = useContext(ThemeContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploaded, setUploaded] = useState();
  const navigate = useNavigate();
  const filePicker = useRef(null);

  const expiresAt = formatDateForMySQL(new Date(Date.now() + 24 * 60 * 60 * 1000)); // +24 години

  const [story, setStory] = useState({
    description: "",
    video: "",
    user_id: userData?.id || null,
    expires_at: expiresAt,
  });

  const [modalIsOpen, setIsOpen] = useState(false);
  let subtitle;

  const handleChange = (e) => {
    setStory((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
  
    // Перевірка розміру (не більше 50 МБ)
    const maxSize = 50 * 1024 * 1024; // 50 МБ у байтах
    if (file.size > maxSize) {
      alert("Розмір файлу не повинен перевищувати 50 МБ.");
      return;
    }
  
    setSelectedFile(file);
  };
  

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      // 1. Додаємо 
      const storyRes = await axiosInstance.post(`/stories`, story);
      const storyId = storyRes.data.insertId; // Отримуємо ID нового story з відповіді сервера

      // 2. Якщо вибрано файли, додаємо їх
      if (selectedFile) {
        const formData = new FormData();
        formData.append("files", selectedFile);
        formData.append("storyId", storyId); // Передаємо postId на сервер

        const res = await axiosInstance.post("/upload_story", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const data = res.data;
        if (data.uploadedFiles) {
          setUploaded(data.uploadedFiles);
        }
      }

      // Після успішного додавання посту та зображення перезавантажуємо сторінку
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(t("addStory.error")); // Ключ: "addPost.error"
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
    setMultiplier1("");
    setMultiplier2("");
    setResult("");
  }

  return (
    <div className="addStory">
      <div className="containerAddStory">
        <span onClick={openModal}>Add New Story</span>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Add New Story Modal"
        >
          <span
            className="welcomeAddStory"
            ref={(_subtitle) => (subtitle = _subtitle)}
          >
            {userData
              ? t("addStory.welcome", { name: userData.name })
              : t("addStory.loading")}
          </span>

          <div className="topContainerAddStory">
            <button className="closeAddStory" onClick={closeModal}>
              {t("addStory.close")}
            </button>
            <span className="listTextAddStory">
              {t("addStory.addYourStory")}
            </span>
            <button className="editAddStory" onClick={handleClick}>
              {t("addStory.addPostButton")}{" "}
              {/* Ключ: "addPost.addPostButton" */}
            </button>
          </div>

          {/* ПОЧАТОК Додавання зображення */}
          <div className="leftAddStory">
            <div>
              <button className="buttonAddFile" onClick={handlePick}>
                {t("addStory.addFile")} {/* Ключ: "addPost.addFile" */}
              </button>
              <input
                className="hidden"
                ref={filePicker}
                type="file"
                onChange={handleFileChange}
                accept="image/*,video/mp4,video/webm,video/ogg"
              />
            </div>

            {!selectedFile && (
              <img
                className="noimageAddStory"
                src={
                  darkMode
                    ? "/images/no-image-icon-dark.jpg"
                    : "/images/no-image-icon-light.jpg"
                }
                alt={t("addStory.noImageAlt")}
              />
            )}

            {selectedFile && !uploaded && (
              <div className="selectedFileAddStory">
                <div>
                  <ul>
                    <li>
                      {t("addStory.fileName")}: {selectedFile.name}
                    </li>
                    <li>
                      {t("addStory.fileType")}: {selectedFile.type}
                    </li>
                    <li>
                      {t("addStory.fileSize")}: {selectedFile.size}
                    </li>
                  </ul>
                </div>
                <div>
                  {selectedFile && selectedFile.type.startsWith("video/") && (
                    <video
                      width="320"
                      height="240"
                      controls
                      src={URL.createObjectURL(selectedFile)}
                      className="video-preview"
                    />
                  )}

                  {selectedFile && selectedFile.type.startsWith("image/") && (
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt={t("addStory.previewAlt")}
                      className="image-preview"
                    />
                  )}
                </div>
              </div>
            )}

            {uploaded && uploaded.uploadedFiles.length > 0 && (
              <div>
                <h2>{uploaded.uploadedFiles[0].fileName}</h2>
                <img
                  className="image"
                  src={uploaded.uploadedFiles[0].filePath}
                  alt={uploaded.uploadedFiles[0].fileName}
                />
              </div>
            )}
          </div>

          {/* КІНЕЦЬ Додавання зображення */}

          <div className="rightAddStory">
            <textarea
              className="textarea"
              type="text"
              placeholder={t("addStory.writeAPost")}
              onChange={handleChange}
              name="description"
            />
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default AddStory;
