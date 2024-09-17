import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./taskdatatable.scss";
import { DataGrid } from "@mui/x-data-grid";

// Функція для форматування дати
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(); // Форматування дати в локальному форматі
};


const taskColumns = [
  { field: "task_id", headerName: "TaskId", width: 100 },
  {
    field: "user_name",
    headerName: "User",
    width: 300,
    renderCell: (params) => {
      return params.row.user_name ? params.row.user_name : "Unknown";
    },
  },
  {
    field: "assigned_date",
    headerName: "Assignment Date",
    width: 250,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {formatDate(params.row.assigned_date)}
        </div>
      );
    },
  },
];

function TaskDatatable({ taskId }) {
  const [assignment, setAssignment] = useState([]);

  // Перевірка чи це сторінка адміністратора
  const isAdmin = window.location.pathname.includes("/admin");

  useEffect(() => {
    const fetchAllAssignment = async () => {
      try {
        const res = await axios.get("http://localhost:3001/assignments");
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
      "Ви впевнені, що хочете видалити це призначення?"
    );
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:3001/assignments/${assignmentId}`);
        setAssignment(
          assignment.filter((assignment) => assignment.id !== assignmentId)
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {/* Link з динамічним роутингом */}
            <Link
              to={`/admin/update_assignment/${params.row.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="view-Button">Деталі</div>
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

  // Умовно додаємо actionColumn лише для адміністратора
  const columns = isAdmin ? taskColumns.concat(actionColumn) : taskColumns;

  return (
    <div>
      <div className="projectTitle">Assignment</div>

      <div className="datatable">
        <DataGrid
          className="datagrid"
          rows={assignment}
          columns={columns} // Використовуємо колонки з умовним додаванням
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
          getRowId={(row) => row.id} // Вказуємо, що id йде з поля id
        />
      </div>
    </div>
  );
}

export default TaskDatatable;



