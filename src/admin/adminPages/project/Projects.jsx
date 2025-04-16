import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInstance";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import "./projects.scss";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";


const formatDate = (dateString) => {
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  return new Date(dateString).toLocaleDateString(i18n.language, options);
};


const Projects = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);

  const columns = [
    { field: "orderNumber", headerName: t("projects.n"), width: 50 }, // Ключ: "projects.n"
    {
      field: "image_url",
      headerName: t("projects.image"), // Ключ: "projects.image"
      width: 100,
      renderCell: (params) => (
        <div className="cellWithImg">
          {params.row.image_url ? (
            <img className="cellImg" src={params.row.image_url} alt={params.row.title} />
          ) : (
            <span>{t("projects.noImage")}</span> // Ключ: "projects.noImage"
          )}
        </div>
      ),
    },
    {
      field: "title",
      headerName: t("projects.title"), // Ключ: "projects.title"
      width: 250,
    },
    {
      field: "start_date",
      headerName: t("projects.startDate"), // Ключ: "projects.startDate"
      width: 120,
      renderCell: (params) => (
        <div className="cellWithImg">{formatDate(params.row.start_date)}</div>
      ),
    },
    {
      field: "end_date",
      headerName: t("projects.endDate"), // Ключ: "projects.endDate"
      width: 120,
      renderCell: (params) => (
        <div className="cellWithImg">{formatDate(params.row.end_date)}</div>
      ),
    },
    {
      field: "status_name",
      headerName: t("projects.statusName"), // Ключ: "projects.statusName"
      width: 120,
    },
  ];

  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const res = await axiosInstance.get("/projects");
        // Додаємо порядковий номер для кожного проекту
        const projectsWithOrderNumber = res.data.map((project, index) => ({
          ...project,
          id: project.id, // Ensure 'id' exists and is used by DataGrid
          orderNumber: index + 1, // Порядковий номер
        }));
        setProjects(projectsWithOrderNumber);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllProjects();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      t("projects.deleteConfirmation") // Ключ: "projects.deleteConfirmation"
    );
    if (confirmed) {
      try {
        await axiosInstance.delete("/projects/" + id);
        setProjects(projects.filter((project) => project.id !== id));
      } catch (err) {
        console.log(err);
      }
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: t("projects.action"), // Ключ: "projects.action"
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          {/* Link with dynamic routing */}
          <Link
            to={`/admin/project/${params.row.id}`}
            style={{ textDecoration: "none" }}
          >
            <div className="viewButton">{t("projects.details")}</div> 
          </Link>

          <button
            className="deleteButton"
            onClick={() => handleDelete(params.row.id)}
          >
            {t("projects.delete")} 
          </button>
        </div>
      ),
    },
  ];

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(i18n.language, options);
  };
  
  return (
    <div className="projects">
      <div className="containerProjects">
        <div className="datatableTitle">
          {t("projects.projectsTitle")}
          <Link to="/admin/add_project" className="link">
            {t("projects.addNew")}
          </Link>
        </div>
        <div className="dataGrid">
          <DataGrid
            className="datagrid"
            rows={projects}
            columns={columns.concat(actionColumn)}
            pageSize={9}
            rowsPerPageOptions={[9]}
            checkboxSelection
            getRowId={(row) => row.id} // Ensure 'id' is correctly used as row id
            initialState={{
              sorting: {
                sortModel: [{ field: "orderNumber", sort: "asc" }], // Сортування за порядковим номером
              },
            }}
            sx={{
              "--DataGrid-containerBackground": "var(--DataGrid-containerBackground) !important",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Projects;