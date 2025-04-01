import "./users.scss";
import { useContext, useMemo } from "react";
import { ThemeContext } from "../../../ThemeContext";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../../../axiosInstance";

const userColumns = [
  { field: "id", headerName: "ID", width: 50 },
  {
    field: "name",
    headerName: "Name",
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
    headerName: "Job",
    width: 200,
  },
  {
    field: "phone",
    headerName: "Phone",
    width: 120,
  },
];

const Users = () => {
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
    const confirmed = window.confirm(
      "Ви впевнені, що хочете видалити цього корстувача?"
    );
    if (confirmed) {
      try {
        await axiosInstance.delete(`/users/${id}`);
        setUsers(users.filter((user) => user.id !== id));
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
            <Link
              to={`/admin/users/${params.row.id}`}
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
    <div className="users">
      <div className="containerUsers">
        <div className="datatableTitle">
          Users
          <Link to="/admin/add_user" className="link">
            Add New
          </Link>
        </div>
        <div className="table">
       
  <div>
   
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
    </div>
  );
};

export default Users;
