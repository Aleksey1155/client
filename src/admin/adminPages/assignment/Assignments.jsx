import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../../axiosInstance";
import { DataGrid } from "@mui/x-data-grid";
import "./assignment.scss";
import i18n from "../../../i18n";

const Assignments = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(i18n.language, options);
  };
  
  const assignmentColumns = [
    { field: "id", headerName: t("assignments.id"), width: 12 }, // Ключ: "assignments.id"
    { field: "task_title", headerName: t("assignments.task"), width: 200 }, // Ключ: "assignments.task"
    {
      field: "image_url",
      headerName: t("assignments.image"), // Ключ: "assignments.image"
      width: 0,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            {params.row.image_url ? (
              <img className="cellImg" src={params.row.image_url} alt="" />
            ) : (
              <span>{t("assignments.noImage")}</span> // Ключ: "assignments.noImage"
            )}
          </div>
        );
      },
    },
    {
      field: "user_name",
      headerName: t("assignments.user"), // Ключ: "assignments.user"
      width: 200,
    },
    {
      field: "assigned_date",
      headerName: t("assignments.assignedDate"), // Ключ: "assignments.assignedDate"
      width: 120,
      renderCell: (params) => {
        return <div className="cellWithImg">{formatDate(params.row.assigned_date)}</div>;
      },
    },
  ];

  useEffect(() => {
    const fetchAllAssignments = async () => {
      try {
        const res = await axiosInstance.get("/assignments");
        setAssignments(res.data);
      } catch (err) {
        console.error(t("assignments.fetchAssignmentsError"), err); // Ключ: "assignments.fetchAssignmentsError"
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error(t("assignments.fetchUsersError"), err); // Ключ: "assignments.fetchUsersError"
      }
    };

    fetchAllAssignments();
    fetchUsers();
  }, [t]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      t("assignments.deleteConfirmation") // Ключ: "assignments.deleteConfirmation"
    );
    if (confirmed) {
      try {
        await axiosInstance.delete("/assignments/" + id);
        setAssignments(assignments.filter((assignment) => assignment.id !== id));
      } catch (err) {
        console.error(t("assignments.deleteError"), err); // Ключ: "assignments.deleteError"
      }
    }
  };

  const handleFilterChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const filteredAssignments = selectedUser
    ? assignments.filter(
        (assignment) => assignment.user_id === parseInt(selectedUser)
      )
    : assignments;

  const actionColumn = [
    {
      field: "action",
      headerName: t("assignments.action"), // Ключ: "assignments.action"
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {/* Link with dynamic routing */}
            <Link
              to={`/admin/update_assignment/${params.row.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">{t("assignments.edit")}</div> {/* Ключ: "assignments.edit" */}
            </Link>

            <button
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              {t("assignments.delete")} {/* Ключ: "assignments.delete" */}
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
          {t("assignments.title")} {/* Ключ: "assignments.title" */}
          <Link to="/admin/add_assignment" className="link">
            {t("assignments.addNew")} {/* Ключ: "assignments.addNew" */}
          </Link>
        </div>
        <div className="dataGrid">
          <DataGrid
            className="datagrid"
            rows={assignments}
            columns={assignmentColumns.concat(actionColumn)}
            pageSize={9}
            rowsPerPageOptions={[9]}
            checkboxSelection
            initialState={{
              sorting: {
                sortModel: [{ field: "id", sort: "desc" }],
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