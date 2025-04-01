import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInstance";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import "./assignment.scss";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const assignmentColumns = [
  { field: "id", headerName: "ID", width: 12 },
  { field: "task_title", headerName: "Task", width: 200 }, // Колонка з порядковим номером
  {
    field: "image_url",
    headerName: "Image",
    width: 0,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {params.row.image_url ? (
            <img className="cellImg" src={params.row.image_url} alt="" />
          ) : (
            <span>No image</span>
          )}
        </div>
      );
    },
  },
  {
    field: "user_name",
    headerName: "User",
    width: 200,
  },
  {
    field: "assigned_date",
    headerName: "assigned_date",
    width: 120,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {formatDate(params.row.assigned_date)}
        </div>
      );
    },
  },
];

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    const fetchAllAssignments = async () => {
      try {
        const res = await axiosInstance.get("/assignments");
        setAssignments(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllAssignments();
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Ви впевнені, що хочете видалити цей проект?"
    );
    if (confirmed) {
      try {
        await axiosInstance.delete("/assignments/" + id);
        setAssignments(
          assignments.filter((assignment) => assignment.id !== id)
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleFilterChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredAssignments = selectedUser
    ? assignments.filter(
        (assignment) => assignment.user_id === parseInt(selectedUser)
      )
    : assignments;

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
              to={`/admin/update_assignment/${params.row.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">Редаг</div>
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
    <div className="assignments">
      <div className="containerAssignments">
        <div className="datatableTitle">
          Assignments
          <Link to="/admin/add_assignment" className="link">
            Add New
          </Link>
        </div>
        <div className="dataGrid">
          <DataGrid
            className="datagrid"
            rows={assignments}
            columns={assignmentColumns.concat(actionColumn)} // Колонка `id` не включена
            pageSize={9}
            rowsPerPageOptions={[9]}
            checkboxSelection
            initialState={{
              sorting: {
                sortModel: [{ field: "orderNumber", sort: "desc" }], // Сортування за порядковим номером
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

export default Assignments;
