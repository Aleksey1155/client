import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import "./projects.scss";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const projectColumns = [
  {
    field: "image_url",
    headerName: "Image",
    width: 100,

    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {params.row.image_url ? (
            <img
              className="cellImg"
              src={params.row.image_url}
              alt=""
            />
          ) : (
            <span>No image</span>
          )}
        </div>
      );
    },
  },

  {
    field: "title",
    headerName: "Title",
    width: 250,
  },

  {
    field: "start_date",
    headerName: "Start Date",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">{formatDate(params.row.start_date)}</div>
      );
    },
  },
  {
    field: "end_date",
    headerName: "End Date",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">{formatDate(params.row.end_date)}</div>
      );
    },
  },
  {
    field: "status_name",
    headerName: "Status Name",
    width: 120,
  },
];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  

  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const res = await axios.get("http://localhost:3001/projects");
        setProjects(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllProjects();
  }, []);

  
 
 
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Ви впевнені, що хочете видалити цей проект?"
    );
    if (confirmed) {
      try {
        await axios.delete("http://localhost:3001/projects/" + id);
        setProjects(projects.filter((project) => project.id !== id));
      } catch (err) {
        console.log(err);
      }
    }
  };
  const truncateDescription = (description, maxLength) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "...";
    }
    return description;
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {/* Link with dynamic routing */}
            <Link
              to={`/projects/${params.row.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">Деталі</div>
            </Link>

            <button
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Видалити
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="projects">
      <div className="datatableTitle">
        Projects
        <Link to="/add_project" className="link">
          Add New
        </Link>
      </div>
      <div className="dataGrid"></div>
      <DataGrid
        className="datagrid"
        rows={projects}
        columns={projectColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
     
    </div>
  );
};

export default Projects;
