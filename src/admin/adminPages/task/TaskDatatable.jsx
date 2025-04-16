import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInstance";
import { useParams, Link } from "react-router-dom";
import "./taskdatatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";

// Функція для форматування дати
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(); // Форматування дати в локальному форматі
};

function TaskDatatable({ taskId }) {
  const { t } = useTranslation();
  const [assignment, setAssignment] = useState([]);

  // Перевірка чи це сторінка адміністратора
  const isAdmin = window.location.pathname.includes("/admin");

  const columnsConfig = [
    { field: "task_id", headerName: t("taskdatatable.taskId"), width: 100 }, // Ключ: "taskdatatable.taskId"
    {
      field: "user_name",
      headerName: t("taskdatatable.user"), // Ключ: "taskdatatable.user"
      width: 300,
      renderCell: (params) => {
        return params.row.user_name ? params.row.user_name : t("taskdatatable.unknown"); // Ключ: "taskdatatable.unknown"
      },
    },
    {
      field: "assigned_date",
      headerName: t("taskdatatable.assignmentDate"), // Ключ: "taskdatatable.assignmentDate"
      width: 250,
      renderCell: (params) => (
        <div className="cellWithImg">{formatDate(params.row.assigned_date)}</div>
      ),
    },
  ];

  const actionColumnConfig = [
    {
      field: "action",
      headerName: t("taskdatatable.action"), // Ключ: "taskdatatable.action"
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          {/* Link з динамічним роутингом */}
          <Link
            to={`/admin/update_assignment/${params.row.id}`}
            style={{ textDecoration: "none" }}
          >
            <div className="view-Button">{t("taskdatatable.details")}</div> {/* Ключ: "taskdatatable.details" */}
          </Link>

          <button
            className="deleteButton"
            onClick={() => handleDelete(params.row.id)}
          >
            {t("taskdatatable.delete")} {/* Ключ: "taskdatatable.delete" */}
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchAllAssignment = async () => {
      try {
        const res = await axiosInstance.get("/assignments");
        // Фільтрація призначень для цього завдання
        setAssignment(
          res.data.filter((assignment) => assignment.task_id === Number(taskId))
        );
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllAssignment();
  }, [taskId]);

  const handleDelete = async (assignmentId) => {
    const confirmed = window.confirm(
      t("taskdatatable.deleteConfirmation") // Ключ: "taskdatatable.deleteConfirmation"
    );
    if (confirmed) {
      try {
        await axiosInstance.delete(`/assignments/${assignmentId}`);
        setAssignment(
          assignment.filter((assignment) => assignment.id !== assignmentId)
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  // Умовно додаємо actionColumn лише для адміністратора
  const columns = isAdmin
    ? columnsConfig.concat(actionColumnConfig)
    : columnsConfig;

  return (
    <div>
      <div className="projectTitle">{t("taskdatatable.assignmentTitle")}</div> {/* Ключ: "taskdatatable.assignmentTitle" */}

      <div className="datatable">
        <DataGrid
          className="datagrid"
          rows={assignment}
          columns={columns} // Використовуємо колонки з умовним додаванням
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
          getRowId={(row) => row.id} // Вказуємо, що id йде з поля id
          sx={{
            "--DataGrid-containerBackground":
              "var(--DataGrid-containerBackground) !important",
          }}
        />
      </div>
    </div>
  );
}

export default TaskDatatable;