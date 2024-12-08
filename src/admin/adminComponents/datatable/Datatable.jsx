import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../../../axiosInstance";
import { useEffect } from "react";

const userColumns = [
    { field: "id", headerName: "ID", width: 70 },
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
        field: "role_name",
        headerName: "Role Name",
        width: 200,
      },
    {
      field: "phone",
      headerName: "Phone",
      width: 200,
    },
  ];

const Datatable = () => {
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
      "Ви впевнені, що хочете видалити цей проект?"
    );
    if (confirmed) {
      try {
        await axiosInstance.delete("/users/" + id);
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
            <Link to="/users/test" style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <button
              className="delete"
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
    <div className="datatable">
      <div className="datatableTitle">
        Add New User
        <Link to="/users/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={users}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default Datatable;
