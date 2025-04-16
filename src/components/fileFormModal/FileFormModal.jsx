import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../axiosInstance";
import "./fileFormModal.scss";

const FileFormModal = ({ userName, onClose }) => {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert(t("fileFormModal.selectFileAlert")); // Ключ: "fileFormModal.selectFileAlert"

    const formData = new FormData();
    formData.append("file", file);
    formData.append("comment", comment);
    formData.append("from", userName);

    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      await axiosInstance.post("/api/send-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(t("fileFormModal.sentAlert")); // Ключ: "fileFormModal.sentAlert"
      onClose(); // закрити модалку
    } catch (err) {
      console.error(err);
      alert(t("fileFormModal.errorAlert")); // Ключ: "fileFormModal.errorAlert"
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modal">
        <h3>{t("fileFormModal.title")}</h3> {/* Ключ: "fileFormModal.title" */}
        <form onSubmit={handleSubmit}>
          <textarea
            className="textarea"
            placeholder={t("fileFormModal.commentPlaceholder")} // Ключ: "fileFormModal.commentPlaceholder"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <label className={`file-upload`}>
            <span className="btnFile-Upload">
              {file ? file.name : t("fileFormModal.selectFileButton")} {/* Ключ: "fileFormModal.selectFileButton" */}
            </span>
            <input
              className="hidden"
              type="file"
              onChange={(e) => {
                setFile(e.target.files[0]);
                console.log("Файл вибрано:", e.target.files[0]);
              }}
            />
          </label>

          <button className="button" type="submit">
            {t("fileFormModal.sendButton")} {/* Ключ: "fileFormModal.sendButton" */}
          </button>
          <button className="button" type="button" onClick={onClose}>
            {t("fileFormModal.cancelButton")} {/* Ключ: "fileFormModal.cancelButton" */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FileFormModal;