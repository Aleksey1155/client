import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import ProjectDatatable from "./ProjectDatatable";
import "./projectdetails.scss";
import ImageCarousel from "../../adminComponents/carousel/ImageCarousel";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  // const [tasks, setTasks] = useState([]);
  // const [taskStatuses, setTaskStatuses] = useState([]);
  // const [taskPriorities, setTaskPriorities] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/projects/${id}`);
        setProject(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProject();
  }, [id]);

  useEffect(() => {
    // const fetchAllTasks = async () => {
    //   try {
    //     const res = await axios.get("http://localhost:3001/tasks");
    //     setTasks(res.data.filter((task) => task.project_id === Number(id)));
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };

    // const fetchTaskStatuses = async () => {
    //   try {
    //     const res = await axios.get("http://localhost:3001/task_statuses");
    //     setTaskStatuses(res.data);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };

    // const fetchTaskPriorities = async () => {
    //   try {
    //     const res = await axios.get("http://localhost:3001/task_priorities");
    //     setTaskPriorities(res.data);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };

    const fetchImages = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/project_images`);
        // setImages(res.data);  // This will now contain images specific to the current project
        setImages(res.data.filter((image) => image.project_id === Number(id)));
      } catch (err) {
        console.log(err);
      }
    };

    fetchImages();

    // fetchAllTasks();
    // fetchTaskStatuses();
    // fetchTaskPriorities();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // const truncateDescription = (description, maxLength) => {
  //   if (description.length > maxLength) {
  //     return description.substring(0, maxLength) + "...";
  //   }
  //   return description;
  // };

  // const handleDelete = async (taskId) => {
  //   const confirmed = window.confirm(
  //     "Ви впевнені, що хочете видалити це завдання?"
  //   );
  //   if (confirmed) {
  //     try {
  //       await axios.delete(`http://localhost:3001/tasks/${taskId}`);
  //       setTasks(tasks.filter((task) => task.id !== taskId));
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  // };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="projectDetails">
      <div className="userContainer">
        <div className="top">
          <div className="left">
            <div className="edit">
              <Link to={`/admin/update_project/${project.id}`} className="update">
                EditProject
              </Link>
            </div>
            <div className="title">Information</div>
            <div className="item">
              <img
                src={images.length > 0 ? images[0].url : ""}
                alt=""
                className="itemImg"
              />
              <div className="details">
                <div className="itemTitle">{project.title}</div>
                <div className="detailItem">
                  <span className="itemKey">Start Date:</span>
                  <span className="itemValue">
                    {formatDate(project.start_date)}
                  </span>
                  <span className="itemKey">End Date:</span>
                  <span className="itemValue">
                    {formatDate(project.end_date)}
                  </span>
                  <span className="itemKey">Project Status:</span>
                  <span className="itemValue">{project.status_name}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="title">Project Pictures</div>
            <div className="carousel">
              {/* {" "} */}
              <ImageCarousel images={images} />
            </div>
          </div>
        </div>
        <div className="bottom">
          <div className="title">Project Description</div>
          <div dangerouslySetInnerHTML={{ __html: project.description }} />
        </div>
        <div className="projectDatatable">
          <ProjectDatatable projectId={id} />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
