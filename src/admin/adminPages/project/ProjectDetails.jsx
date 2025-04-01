import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInstance";
import { useParams, Link } from "react-router-dom";
import ProjectDatatable from "./ProjectDatatable";
import "./projectdetails.scss";
import ImageCarousel from "../../adminComponents/carousel/ImageCarousel";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axiosInstance.get(`/projects/${id}`);
        setProject(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProject();
  }, [id]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axiosInstance.get(`/project_images`);

        setImages(res.data.filter((image) => image.project_id === Number(id)));
      } catch (err) {
        console.log(err);
      }
    };

    fetchImages();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="projectDetails">
      <div className="projectContainer">
        <div className="topProjectDetails">
          <div className="leftProjectDetails">
            <div className="editProjectDetails">
              <Link
                to={`/admin/update_project/${project.id}`}
                className="update"
              >
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
                  <span className="itemKey">Actual End Date:</span>
                  <span className="itemValue">
                    {project.actual_end_date
                      ? formatDate(project.actual_end_date)
                      : "Не завершено"}
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
