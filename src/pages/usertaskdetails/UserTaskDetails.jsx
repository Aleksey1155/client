import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./userTaskDetails.scss";
import TaskDatatable from "../../admin/adminPages/task/TaskDatatable";
import ImageCarousel from "../../admin/adminComponents/carousel/ImageCarousel";

function UserTaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/tasks/${id}`);
        setTask(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchImages = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/task_images`);
        // setImages(res.data);  // This will now contain images specific to the current project
        setImages(res.data.filter((image) => image.task_id === Number(id)));
      } catch (err) {
        console.log(err);
      }
    };

    fetchImages();

    fetchTask();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="userTaskDetails">
      <div className="taskContainer">
        <div className="top">
          <div className="left">
            
            <div className="title">Information</div>
            <div className="item">
              <img
                src={images.length > 0 ? images[0].url : ""}
                alt=""
                className="itemImg"
              />
              <div className="details">
                <div className="itemTitle">{task.title}</div>
                <div className="detailItem">
                  <span className="itemKey">Start Date:</span>
                  <span className="itemValue">
                    {formatDate(task.start_date)}
                  </span>
                  <span className="itemKey">End Date:</span>
                  <span className="itemValue">{formatDate(task.end_date)}</span>
                  <span className="itemKey">Task Status:</span>
                  <span className="itemValue">{task.status_name}</span>
                  <span className="itemKey">Task Priority:</span>
                  <span className="itemValue">{task.priority_name}</span>
                  <span className="itemKey">Project Title:</span>
                  <span className="itemProject">{task.project_title}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="title">Task Pictures</div>
            <div className="carousel">
            
              <ImageCarousel images={images} />
            </div>
          </div>
        </div>
        <div className="bottom">
          <div className="title">Task Description</div>
          <div dangerouslySetInnerHTML={{ __html: task.description }} />
        </div>
        <div className="taskDatatable">
          <TaskDatatable taskId={id} />
        </div>
      </div>
    </div>
  );
}

export default UserTaskDetails;
