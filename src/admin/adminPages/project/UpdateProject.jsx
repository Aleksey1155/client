import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../axiosInstance";
import ReactQuill from "react-quill";
import { DateTime } from "luxon";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import "./updateproject.scss";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import Zoom from "react-medium-image-zoom";
import { useTranslation } from "react-i18next";

const UpdateProject = () => {
  const { t } = useTranslation();
  const [project, setProject] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    actual_end_date: "",
    status_id: "",
  });

  const filePicker = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploaded, setUploaded] = useState();
  const [statuses, setStatuses] = useState([]);
  const [images, setImages] = useState([]);

  const navigate = useNavigate();
  const { id: projectId } = useParams();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axiosInstance.get(`/projects/${projectId}`);
        const projectData = res.data;
        setProject({
          title: projectData.title,
          description: projectData.description,
          start_date: projectData.start_date
            ? DateTime.fromISO(projectData.start_date).toISODate()
            : "",
          end_date: projectData.end_date
            ? DateTime.fromISO(projectData.end_date).toISODate()
            : "",
          actual_end_date: projectData.actual_end_date
            ? DateTime.fromISO(projectData.actual_end_date).toISODate()
            : "",
          status_id: projectData.status_id,
        });
      } catch (err) {
        console.log(err);
      }
    };

    const fetchStatuses = async () => {
      try {
        const res = await axiosInstance.get("/project_statuses");
        setStatuses(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchImages = async () => {
      try {
        const res = await axiosInstance.get(`/project_images`);
        setImages(
          res.data.filter((image) => image.project_id === Number(projectId))
        );
      } catch (err) {
        console.log(err);
      }
    };

    fetchImages();
    fetchProject();
    fetchStatuses();
  }, [projectId]);

  const handleChange = (e) => {
    setProject((prev) => ({
      ...prev,
      [e.target.name]: e.target.value === "" ? null : e.target.value,
    }));
  };

  const handleEditorChange = (content) => {
    setProject((prev) => ({ ...prev, description: content }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    const updatedProject = {
      ...project,
      actual_end_date: project.actual_end_date || null,
    };

    try {
      await axiosInstance.put(`/projects/${projectId}`, updatedProject);
      navigate(`/admin/project/${projectId}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteImg = async (id) => {
    const confirmed = window.confirm(
      t("updateproject.deleteImageConfirmation") // Ключ: "updateproject.deleteImageConfirmation"
    );
    if (confirmed) {
      try {
        await axiosInstance.delete("/project_images/" + id);
        setImages(images.filter((image) => image.id !== id));
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert(t("updateproject.selectFileAlert")); // Ключ: "updateproject.selectFileAlert"
      return;
    }

    const formData = new FormData();
    formData.append("files", selectedFile);
    formData.append("project_id", projectId); // Передаємо project_id

    try {
      const res = await axiosInstance.post("/upload_project", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploaded(res.data);

      setTimeout(() => {
        navigate(0);
      }, 1000);
    } catch (error) {
      console.error("Upload Error: ", error);
      alert(t("updateproject.uploadErrorAlert")); // Ключ: "updateproject.uploadErrorAlert"
    }
  };

  const handlePick = () => {
    filePicker.current.click();
  };

  return (
    <div className="updateproject">
      <div className="updateprojectContainer">
        <div className="top">
          <p className="title">{t("updateproject.title")}</p> {/* Ключ: "updateproject.title" */}
          <button className="button" onClick={handleClick}>
            {t("updateproject.editButton")} {/* Ключ: "updateproject.editButton" */}
          </button>
        </div>
        <div className="center">
          <div className="left">
            <div>
              <button className="buttonAddFile" onClick={handlePick}>
                {t("updateproject.addFileButton")} {/* Ключ: "updateproject.addFileButton" */}
              </button>
              <input
                className="hidden"
                ref={filePicker}
                type="file"
                onChange={handleFileChange}
                accept="image/*, .png, .jpg, .web"
              />
              <button className="buttonAddFile" onClick={handleUpload}>
                {t("updateproject.uploadNowButton")} {/* Ключ: "updateproject.uploadNowButton" */}
              </button>
            </div>

            {!selectedFile && (
              <img
                className="noimage"
                src="https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                alt={t("updateproject.noImageAlt")} // Ключ: "updateproject.noImageAlt"
              />
            )}

            {selectedFile && !uploaded && (
              <div className="selectedFile">
                <ul>
                  <li>{t("updateproject.fileName")}: {selectedFile.name}</li> {/* Ключ: "updateproject.fileName" */}
                  <li>{t("updateproject.fileType")}: {selectedFile.type}</li> {/* Ключ: "updateproject.fileType" */}
                  <li>{t("updateproject.fileSize")}: {selectedFile.size}</li> {/* Ключ: "updateproject.fileSize" */}
                </ul>
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
          <div className="right">
            <form>
              <div className="formInput">
                <label>{t("updateproject.projectTitleLabel")}</label> {/* Ключ: "updateproject.projectTitleLabel" */}
                <input
                  className="input"
                  type="text"
                  placeholder={t("updateproject.projectTitlePlaceholder")} // Ключ: "updateproject.projectTitlePlaceholder"
                  onChange={handleChange}
                  name="title"
                  value={project.title}
                />
              </div>
              <div className="formInput"></div>

              <div className="formInput" onClick={(e) => e.currentTarget.querySelector("input").showPicker()}>
                <label>{t("updateproject.startDateLabel")}</label> {/* Ключ: "updateproject.startDateLabel" */}
                <input
                  className="inputDate"
                  type="date"
                  placeholder={t("updateproject.startDatePlaceholder")} // Ключ: "updateproject.startDatePlaceholder"
                  onChange={handleChange}
                  name="start_date"
                  value={project.start_date}
                />
              </div>
              <div className="formInput" onClick={(e) => e.currentTarget.querySelector("input").showPicker()}>
                <label>{t("updateproject.endDateLabel")}</label> {/* Ключ: "updateproject.endDateLabel" */}
                <input
                  className="inputDate"
                  type="date"
                  placeholder={t("updateproject.endDatePlaceholder")} // Ключ: "updateproject.endDatePlaceholder"
                  onChange={handleChange}
                  name="end_date"
                  value={project.end_date}
                />
              </div>

              <div className="formInput" onClick={(e) => e.currentTarget.querySelector("input").showPicker()}>
                <label>{t("updateproject.actualEndDateLabel")}</label> {/* Ключ: "updateproject.actualEndDateLabel" */}
                <input
                  className="inputDate"
                  type="date"
                  placeholder={t("updateproject.actualEndDatePlaceholder")} // Ключ: "updateproject.actualEndDatePlaceholder"
                  onChange={handleChange}
                  name="actual_end_date"
                  value={project.actual_end_date || ""} // якщо null, підставляється ""
                />
              </div>

              <div className="formInput">
                <label>{t("updateproject.statusLabel")}</label> {/* Ключ: "updateproject.statusLabel" */}
                <select
                  className="select"
                  name="status_id"
                  onChange={handleChange}
                  value={project.status_id}
                >
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
          <div className="title">{t("updateproject.projectImagesTitle")}</div> {/* Ключ: "updateproject.projectImagesTitle" */}
          <div className="images">
            {images.map((image, index) => (
              <div key={index}>
                <RemoveCircleOutlineOutlinedIcon
                  className="icon"
                  onClick={() => handleDeleteImg(image.id)}
                />
                <Zoom>
                  <img
                    src={image.url}
                    alt={`${t("updateproject.image")} ${index + 1}`} // Ключ: "updateproject.image"
                    className="image"
                  />
                </Zoom>
              </div>
            ))}
          </div>
        </div>
        <div className="bottom">
          <div className="title">{t("updateproject.descriptionTitle")}</div> {/* Ключ: "updateproject.descriptionTitle" */}
          <div className="description">
            <div className="formInput">
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
    </div>
  );
};

export default UpdateProject;