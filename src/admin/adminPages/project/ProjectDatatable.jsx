import "./projectdatatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import axiosInstance from "../../../axiosInstance";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Функція для форматування дати
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(); // Форматування дати в локальному форматі
};

const ProjectDatatable = ({ projectId }) => {
  const { t } = useTranslation();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const columns = [
    { field: "title", headerName: t("projectdatatable.taskTitle"), width: 200 }, // Ключ: "projectdatatable.taskTitle"
    {
      field: "task.start_date",
      headerName: t("projectdatatable.startDate"), // Ключ: "projectdatatable.startDate"
      width: 120,
      renderCell: (params) => (
        <div className="cellWithImg">
          {formatDate(params.row.start_date)}
        </div>
      ),
    },
    {
      field: "task.end_date",
      headerName: t("projectdatatable.endDate"), // Ключ: "projectdatatable.endDate"
      width: 120,
      renderCell: (params) => (
        <div className="cellWithImg">
          {formatDate(params.row.end_date)}
        </div>
      ),
    },
    { field: "priority_name", headerName: t("projectdatatable.priority"), width: 120 }, // Ключ: "projectdatatable.priority"
    { field: "status_name", headerName: t("projectdatatable.status"), width: 120 }, // Ключ: "projectdatatable.status"
  ];

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axiosInstance.get(`/projects/${projectId}`);
        setProject(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchAllTasks = async () => {
      try {
        const res = await axiosInstance.get("/tasks");
        setTasks(
          res.data.filter((task) => task.project_id === Number(projectId))
        );
      } catch (err) {
        console.log(err);
      }
    };

    fetchProject();
    fetchAllTasks();
  }, [projectId]);

  const handleDelete = async (taskId) => {
    const confirmed = window.confirm(
      t("projectdatatable.deleteConfirmation") // Ключ: "projectdatatable.deleteConfirmation"
    );
    if (confirmed) {
      try {
        await axiosInstance.delete(`/tasks/${taskId}`);
        setTasks(tasks.filter((task) => task.id !== taskId));
      } catch (err) {
        console.log(err);
      }
    }
  };

  if (!project) {
    return <div>{t("projectdatatable.loading")}...</div>; // Ключ: "projectdatatable.loading"
  }

  const actionColumn = [
    {
      field: "action",
      headerName: t("projectdatatable.action"), // Ключ: "projectdatatable.action"
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          {/* Link with dynamic routing */}
          <Link
            to={`/admin/task/${params.row.id}`}
            style={{ textDecoration: "none" }}
          >
            <div className="view-Button">{t("projectdatatable.details")}</div> {/* Ключ: "projectdatatable.details" */}
          </Link>

          <button
            className="deleteButton"
            onClick={() => handleDelete(params.row.id)}
          >
            {t("projectdatatable.delete")} {/* Ключ: "projectdatatable.delete" */}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="projectDatatable">
      <div className="projectTitle">{t("projectdatatable.projectTasks")}</div> {/* Ключ: "projectdatatable.projectTasks" */}

      <div className="datatable">
        <DataGrid
          className="datagrid"
          rows={tasks}
          columns={columns.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
          getRowId={(row) => row.id} // Вказуємо, що id йде з поля id
          sx={{
            "--DataGrid-containerBackground": "var(--DataGrid-containerBackground) !important",
          }}
        />
      </div>
    </div>
  );
};

export default ProjectDatatable;