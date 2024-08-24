import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import { DateTime } from "luxon";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import "./updateproject.scss";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import Zoom from "react-medium-image-zoom";

const hostUrl = "http://localhost:3001/upload";

const UpdateProject = () => {
  const [project, setProject] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    status_id: "",
  });

  const filePicker = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploaded, setUploaded] = useState();
  const [statuses, setStatuses] = useState([]);
  const [images, setImages] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const projectId = location.pathname.split("/")[2];

  console.log("selectedFile --" + selectedFile); //--------------------

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/projects/${projectId}`
        );
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
          status_id: projectData.status_id,
        });
      } catch (err) {
        console.log(err);
      }
    };

    const fetchStatuses = async () => {
      try {
        const res = await axios.get("http://localhost:3001/project_statuses");
        setStatuses(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchImages = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/project_images`);
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
    setProject((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditorChange = (content) => {
    setProject((prev) => ({ ...prev, description: content }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/projects/${projectId}`, project);
      navigate(`/projects/${projectId}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteImg = async (id) => {
    const confirmed = window.confirm(
      "Ви впевнені, що хочете видалити цей image?"
    );
    if (confirmed) {
      try {
        await axios.delete("http://localhost:3001/project_images/" + id);
        setImages(images.filter((image) => image.id !== id));
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleFileChange = (event) => {
    console.log(event.target.files); //--------------------------------
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("project_id", projectId); // Передаємо project_id

    const res = await fetch(hostUrl, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploaded(data);
    // Затримка на 1 секунду перед оновленням сторінки
    setTimeout(() => {
      navigate(0); // Перенаправляємо на ту ж сторінку для оновлення
    }, 1000); // 1000 мс = 1 секунда
  };

  const handlePick = () => {
    filePicker.current.click();
  };

  return (
    <div className="updateproject">
      <div className="updateprojectContainer">
        <div className="top">
          <p className="title">Update project</p>
          <button className="nav-addlink" onClick={handleClick}>
            Редагувати
          </button>
        </div>
        <div className="center">
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

            {!selectedFile && (
              <img
                className="noimage"
                src="https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                alt=""
              />
            )}

            {selectedFile && !uploaded && (
              <div className="selectedFile">
                <ul>
                  <li>Name: {selectedFile.name}</li>
                  <li>Type: {selectedFile.type}</li>
                  <li>Size: {selectedFile.size}</li>
                </ul>
              </div>
            )}

            {uploaded && (
              <div>
                <h2>{uploaded.fileName}</h2>
                <img className="image" src={uploaded.filePath} alt="" />
              </div>
            )}

            {/* {uploaded && (
              <img className="image" src={uploaded.filePath} alt="" />
            )} */}
          </div>
          <div className="right">
            <form>
              <div className="formInput"></div>

              <div className="formInput">
                <label>Project Title</label>
                <input
                  type="text"
                  placeholder="name"
                  onChange={handleChange}
                  name="title"
                  value={project.title}
                />
              </div>

              <div className="formInput">
                <label>start_date</label>
                <input
                  type="text"
                  placeholder="start_date"
                  onChange={handleChange}
                  name="start_date"
                  value={project.start_date}
                />
              </div>
              <div className="formInput">
                <label>end_date</label>
                <input
                  type="text"
                  placeholder="end_date"
                  onChange={handleChange}
                  name="end_date"
                  value={project.end_date}
                />
              </div>

              <div className="formInput">
                <label>Status</label>
                <select
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
          <div className="title">Project Images</div>
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
                    alt={`Image ${index + 1}`}
                    className="image"
                  />
                </Zoom>
              </div>
            ))}
          </div>
        </div>
        <div className="bottom">
          <div className="title">Description</div>
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
      {/* Відображення інформації про вибраний файл */}
    </div>
  );
};

export default UpdateProject;
