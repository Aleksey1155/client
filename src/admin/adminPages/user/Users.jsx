import "./users.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

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
    field: "role_name",
    headerName: "Role Name",
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
        const res = await axios.get("http://localhost:3001/users");
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
        await axios.delete(`http://localhost:3001/users/${id}`);
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
            {/* Link with dynamic routing */}
           <Link to={`/admin/users/${params.row.id}`} style={{ textDecoration: "none" }}>
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
      <div className="datatableTitle">
         Users
        <Link to="/admin/add_user" className="link">
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

export default Users;
