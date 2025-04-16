import "./users.scss";
import { useContext, useMemo } from "react";
import { ThemeContext } from "../../../ThemeContext";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../../../axiosInstance";
import { useTranslation } from "react-i18next";

const Users = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await axiosInstance.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllUsers();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(t("confirmDeleteUser"));
    if (confirmed) {
      try {
        await axiosInstance.delete(`/users/${id}`);
        setUsers(users.filter((user) => user.id !== id));
      } catch (err) {
        console.log(err);
      }
    }
  };

  const userColumns = useMemo(() => [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "name",
      headerName: t("name"),
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img className="cellImg" src={params.row.img} alt="avatar" />
            {params.row.name}
          </div>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "job_name",
      headerName: t("job"),
      width: 200,
    },
    {
      field: "phone",
      headerName: t("phone"),
      width: 120,
    },
  ], [t]);

  const actionColumn = useMemo(() => [
    {
      field: "action",
      headerName: t("action"),
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              to={`/admin/user/${params.row.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">{t("details")}</div>
            </Link>
            <button
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              {t("delete")}
            </button>
          </div>
        );
      },
    },
  ], [t, users]);

  return (
    <div className="users">
      <div className="containerUsers">
        <div className="datatableTitle">
          {t("users")}
          <Link to="/admin/add_user" className="link">
            {t("addNewUser")}
          </Link>
        </div>
        <div className="table">
          <DataGrid
            className="datagrid"
            rows={users}
            columns={userColumns.concat(actionColumn)}
            pageSize={9}
            rowsPerPageOptions={[9]}
            checkboxSelection
            sx={{
              "--DataGrid-containerBackground": "var(--DataGrid-containerBackground) !important",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Users;
