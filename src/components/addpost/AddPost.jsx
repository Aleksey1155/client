import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../ThemeContext"; // шлях до ThemeContext
import axiosInstance from "../../axiosInstance";
import config from "../../config";
import Modal from "react-modal";
import "./addPost.scss";

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

function AddPost({ userData }) {
  const { t } = useTranslation();
  const { darkMode } = useContext(ThemeContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploaded, setUploaded] = useState();
  const navigate = useNavigate();
  const filePicker = useRef(null);
  const [post, setPost] = useState({
    description: "",
    img: "",
    user_id: userData?.id || null, // Додаємо перевірку
  });
  const [modalIsOpen, setIsOpen] = useState(false);
  let subtitle;

  const handleChange = (e) => {
    setPost((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      // 1. Додаємо пост
      const postRes = await axiosInstance.post(`/posts`, post);
      const postId = postRes.data.insertId; // Отримуємо ID нового посту з відповіді сервера

      // 2. Якщо вибрано файли, додаємо їх
      if (selectedFile) {
        const formData = new FormData();
        formData.append("files", selectedFile);
        formData.append("postId", postId); // Передаємо postId на сервер

        const res = await axiosInstance.post("/upload_post", formData, {
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
      alert(t("addPost.error")); // Ключ: "addPost.error"
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
    <div className="addPost">
      <div className="containerAddPost">
        <span onClick={openModal}>{t("addPost.addNewPost")}</span> {/* Ключ: "addPost.addNewPost" */}
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel={t("addPost.modalLabel")} // Ключ: "addPost.modalLabel"
        >
          <span
            className="welcomeAddPost"
            ref={(_subtitle) => (subtitle = _subtitle)}
          >
            {userData ? t("addPost.welcome", { name: userData.name }) : t("addPost.loading")} {/* Ключі: "addPost.welcome", "addPost.loading" */}
          </span>

          <div className="topContainerAddPost">
            <button className="closeAddPost" onClick={closeModal}>
              {t("addPost.close")} {/* Ключ: "addPost.close" */}
            </button>
            <span className="listTextAddPost">{t("addPost.addYourPost")}</span> {/* Ключ: "addPost.addYourPost" */}
            <button className="editAddPost" onClick={handleClick}>
              {t("addPost.addPostButton")} {/* Ключ: "addPost.addPostButton" */}
            </button>
          </div>

          {/* ПОЧАТОК Додавання зображення */}
          <div className="leftAddPost">
            <div>
              <button className="buttonAddFile" onClick={handlePick}>
                {t("addPost.addFile")} {/* Ключ: "addPost.addFile" */}
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
                className="noimageAddPost"
                src={
                  darkMode
                    ? "/images/no-image-icon-dark.jpg"
                    : "/images/no-image-icon-light.jpg"
                }
                alt={t("addPost.noImageAlt")} // Ключ: "addPost.noImageAlt"
              />
            )}

            {selectedFile && !uploaded && (
              <div className="selectedFileAddPost">
                <div>
                  <ul>
                    <li>{t("addPost.fileName")}: {selectedFile.name}</li> {/* Ключ: "addPost.fileName" */}
                    <li>{t("addPost.fileType")}: {selectedFile.type}</li> {/* Ключ: "addPost.fileType" */}
                    <li>{t("addPost.fileSize")}: {selectedFile.size}</li> {/* Ключ: "addPost.fileSize" */}
                  </ul>
                </div>
                <div>
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt={t("addPost.previewAlt")} // Ключ: "addPost.previewAlt"
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
                  alt={uploaded.uploadedFiles[0].fileName}
                />
              </div>
            )}
          </div>

          {/* КІНЕЦЬ Додавання зображення */}

          <div className="rightAddPost">
            <textarea
              className="textarea"
              type="text"
              placeholder={t("addPost.writeAPost")} // Ключ: "addPost.writeAPost"
              onChange={handleChange}
              name="description"
            />
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default AddPost;