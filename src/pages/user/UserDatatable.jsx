import "./userdatatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useState, useEffect } from "react";

// Функція для форматування дати
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(); // Форматування дати в локальному форматі
};

const userColumns = [
  // { field: "user_id", headerName: "User ID", width: 70 },
  { field: "user_name", headerName: "User Name", width: 200 },
  { field: "task_title", headerName: "Task Title", width: 300 },
  { 
    field: "start_date", 
    headerName: "Start Date", 
    width: 200,
    renderCell: (params) => formatDate(params.value) // Форматування дати для start_date
  },
  { 
    field: "end_date", 
    headerName: "End Date", 
    width: 200,
    renderCell: (params) => formatDate(params.value) // Форматування дати для end_date
  },
];

const UserDatatable = ({ userId }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (userId) {
      const fetchAllUsers = async () => {
        try {
          const res = await axios.get(`http://localhost:3001/userdetails/${userId}`);
          const dataWithId = res.data.map((item, index) => ({
            ...item,
            id: `${item.user_id}-${index}` // Створення унікального id для кожного рядка
          }));
          setUsers(dataWithId);
          console.log("Fetched Data:", dataWithId); // Логування отриманих даних
        } catch (err) {
          console.log("Error fetching data:", err);
        }
      };

      fetchAllUsers();
    }
  }, [userId]);

  return (
    <div className="datatable">
      <DataGrid
        className="datagrid"
        rows={users}
        columns={userColumns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={(row) => row.id}  // Вказуємо, що id йде з поля id
      />
    </div>
  );
};

export default UserDatatable;
