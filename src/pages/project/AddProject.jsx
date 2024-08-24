import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./addproject.scss";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";

const AddProject = () => {
  const [project, setProject] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    status_id: "",
  });

  const [statuses, setStatuses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await axios.get("http://localhost:3001/project_statuses");
        setStatuses(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchStatuses();
  }, []);

  const handleChange = (e) => {
    setProject((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditorChange = (content) => {
    setProject((prev) => ({ ...prev, description: content }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/projects", project);
      navigate("/projects");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="addproject">
      <div className="addprojectContainer">
        <div className="top">
          <p className="title">New project</p>
          <button className="nav-addlink" onClick={handleClick}>
            Додати
          </button>
        </div>
        <div className="center">
          <div className="left">
            <img
              className="image"
              src="https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              alt=""
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  {" "}
                  Image:
                  <FolderOpenOutlinedIcon className="icon" />
                </label>
                <input type="file" id="file" style={{ display: "none" }} />
              </div>

              <div className="formInput">
                <label>Project title</label>
                <input
                  type="text"
                  placeholder="Назва нового проекту"
                  onChange={handleChange}
                  name="title"
                />
              </div>

              <div className="formInput">
                <label>Start Date</label>
                <input
                  type="date"
                  placeholder="start_date"
                  onChange={handleChange}
                  name="start_date"
                />
              </div>
              <div className="formInput">
                <label>End Date</label>
                <input
                  type="date"
                  placeholder="end_date"
                  onChange={handleChange}
                  name="end_date"
                />
              </div>

              
              <div className="formInput">
                <label>Status</label>
                <select
                  name="status_id"
                  onChange={handleChange}
                  value={project.status_id}
                >
                  <option value="" disabled>
                    Виберіть статус
                  </option>
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
        <div className="bottom">
        
                <label>Description</label>
              
          <div className="description">
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
  );
};

export default AddProject;
