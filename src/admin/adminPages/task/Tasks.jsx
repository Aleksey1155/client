import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInstance";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import "./tasks.scss";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";



const Tasks = () => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);

  const columnsConfig = [
    {
      field: "image_url",
      headerName: t("tasks.image"), // Ключ: "tasks.image"
      width: 80,
      renderCell: (params) => (
        <div className="cellWithImg">
          {params.row.image_url ? (
            <img className="cellImg" src={params.row.image_url} alt="" />
          ) : (
            <span>{t("tasks.noImage")}</span> // Ключ: "tasks.noImage"
          )}
        </div>
      ),
    },
    {
      field: "title",
      headerName: t("tasks.taskTitle"), // Ключ: "tasks.taskTitle"
      width: 200,
    },
    {
      field: "project_title",
      headerName: t("tasks.projectTitle"), // Ключ: "tasks.projectTitle"
      width: 150,
    },
    {
      field: "start_date",
      headerName: t("tasks.startDate"), // Ключ: "tasks.startDate"
      width: 100,
      renderCell: (params) => (
        <div className="cellWithImg">{formatDate(params.row.start_date)}</div>
      ),
    },
    {
      field: "end_date",
      headerName: t("tasks.endDate"), // Ключ: "tasks.endDate"
      width: 100,
      renderCell: (params) => (
        <div className="cellWithImg">{formatDate(params.row.end_date)}</div>
      ),
    },
    {
      field: "status_name",
      headerName: t("tasks.status"), // Ключ: "tasks.status"
      width: 100,
    },
    {
      field: "priority_name",
      headerName: t("tasks.priority"), // Ключ: "tasks.priority"
      width: 80,
    },
  ];

  const actionColumnConfig = [
    {
      field: "action",
      headerName: t("tasks.action"), // Ключ: "tasks.action"
      width: 180,
      renderCell: (params) => (
        <div className="cellAction">
          {/* Link with dynamic routing */}
          <Link
            to={`/admin/task/${params.row.id}`}
            style={{ textDecoration: "none" }}
          >
            <div className="viewButton">{t("tasks.details")}</div> {/* Ключ: "tasks.details" */}
          </Link>

          <button
            className="deleteButton"
            onClick={() => handleDelete(params.row.id)}
          >
            {t("tasks.delete")} {/* Ключ: "tasks.delete" */}
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const res = await axiosInstance.get("/tasks");
        console.log(res.data);
        setTasks(sortTasks(res.data));
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllTasks();
  }, []);

  const sortTasks = (tasks) => {
    return tasks.sort((a, b) => {
      if (a.project_id !== b.project_id) {
        return a.project_id - b.project_id;
      }
      if (a.id !== b.id) {
        return a.id - b.id;
      }
      if (a.priority_name !== b.priority_name) {
        return a.priority_name.localeCompare(b.priority_name);
      }
      if (a.status_name !== b.status_name) {
        return a.status_name.localeCompare(b.status_name);
      }
      return new Date(a.start_date) - new Date(b.start_date);
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      t("tasks.deleteConfirmation") // Ключ: "tasks.deleteConfirmation"
    );
    if (confirmed) {
      try {
        await axiosInstance.delete("/tasks/" + id);
        setTasks(sortTasks(tasks.filter((task) => task.id !== id)));
      } catch (err) {
        console.log(err);
      }
    }
  };

  const columns = columnsConfig.concat(actionColumnConfig);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(i18n.language, options);
  };
  

  return (
    <div className="tasks">
      <div className="containerTask">
        <div className="datatableTitle">
          {t("tasks.tasksTitle")} {/* Ключ: "tasks.tasksTitle" */}
          <Link to="/admin/add_task" className="link">
            {t("tasks.addNew")} {/* Ключ: "tasks.addNew" */}
          </Link>
        </div>
        <div className="dataGrid">
          <DataGrid
            className="datagrid"
            rows={tasks}
            columns={columns}
            pageSize={9}
            rowsPerPageOptions={[9]}
            checkboxSelection
            initialState={{
              sorting: {
                sortModel: [{ field: "orderNumber", sort: "desc" }], // Сортування за порядковим номером (якщо потрібно)
              },
            }}
            sx={{
              "--DataGrid-containerBackground":
                "var(--DataGrid-containerBackground) !important",
            }}
            getRowId={(row) => row.id} // Ensure `id` is used as the row id
          />
        </div>
      </div>
    </div>
  );
};

export default Tasks;