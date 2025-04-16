import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInstance";
import { useParams, Link } from "react-router-dom";
import ProjectDatatable from "./ProjectDatatable";
import "./projectdetails.scss";
import ImageCarousel from "../../adminComponents/carousel/ImageCarousel";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [images, setImages] = useState([]);
  const { t } = useTranslation();

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
    return new Date(dateString).toLocaleDateString(i18n.language, options);
  };

  if (!project) {
    return <div>{t("projectdetails.loading")}...</div>; // Ключ: "projectdetails.loading"
  }

  return (
    <div className="projectDetails">
      <div className="projectContainer">
        <div className="topProjectDetails">
          <div className="leftProjectDetails">


            <div className="itemImgProject">
              <div className="title">{t("projectdetails.information")}</div>{" "}
              <img
                src={images.length > 0 ? images[0].url : ""}
                alt={project.title}
                className="itemImg"
              />
              {/* Ключ: "projectdetails.information" */}
            </div>



            <div className="itemProject">


              <div className="editProjectDetails">
                <Link
                  to={`/admin/update_project/${project.id}`}
                  className="update"
                >
                  {t("projectdetails.editProject")}{" "}
                  {/* Ключ: "projectdetails.editProject" */}
                </Link>
              </div>

              

              <div className="details">
                <div className="itemTitle">{project.title}</div>
                <div className="detailItem">
                  <span className="itemKey">
                    {t("projectdetails.startDate")}:
                  </span>{" "}
                  {/* Ключ: "projectdetails.startDate" */}
                  <span className="itemValue">
                    {formatDate(project.start_date)}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">
                    {t("projectdetails.endDate")}:
                  </span>{" "}
                  {/* Ключ: "projectdetails.endDate" */}
                  <span className="itemValue">
                    {formatDate(project.end_date)}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">
                    {t("projectdetails.actualEndDate")}:
                  </span>{" "}
                  {/* Ключ: "projectdetails.actualEndDate" */}
                  <span className="itemValue">
                    {project.actual_end_date
                      ? formatDate(project.actual_end_date)
                      : t("projectdetails.notCompleted")}{" "}
                    {/* Ключ: "projectdetails.notCompleted" */}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">
                    {t("projectdetails.projectStatus")}:
                  </span>{" "}
                  {/* Ключ: "projectdetails.projectStatus" */}
                  <span className="itemValue">{project.status_name}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="title">{t("projectdetails.projectPictures")}</div>{" "}
            {/* Ключ: "projectdetails.projectPictures" */}
            <div className="carousel">
              <ImageCarousel images={images} />
            </div>
          </div>
        </div>
        <div className="bottom">
          <div className="title">{t("projectdetails.projectDescription")}</div>{" "}
          {/* Ключ: "projectdetails.projectDescription" */}
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
