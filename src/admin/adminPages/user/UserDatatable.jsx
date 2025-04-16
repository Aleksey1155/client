import "./userdatatable.scss";
import axiosInstance from "../../../axiosInstance";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// Функція для форматування дати
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(); // Форматування дати в локальному форматі
};

const UserDatatable = ({ userId }) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);

  const columns = [
    // { field: "user_id", headerName: t("userdatatable.userId"), width: 70 }, // Ключ: "userdatatable.userId"
    { field: "user_name", headerName: t("userdatatable.userName"), width: 200 }, // Ключ: "userdatatable.userName"
    { field: "task_title", headerName: t("userdatatable.taskTitle"), width: 300 }, // Ключ: "userdatatable.taskTitle"
    {
      field: "start_date",
      headerName: t("userdatatable.startDate"), // Ключ: "userdatatable.startDate"
      width: 200,
      renderCell: (params) => formatDate(params.value), // Форматування дати для start_date
    },
    {
      field: "end_date",
      headerName: t("userdatatable.endDate"), // Ключ: "userdatatable.endDate"
      width: 200,
      renderCell: (params) => formatDate(params.value), // Форматування дати для end_date
    },
  ];

  useEffect(() => {
    if (userId) {
      const fetchAllUsers = async () => {
        try {
          const res = await axiosInstance.get(`/userdetails/${userId}`);
          const dataWithId = res.data.map((item, index) => ({
            ...item,
            id: `${item.user_id}-${index}`, // Створення унікального id для кожного рядка
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
        columns={columns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={(row) => row.id} // Вказуємо, що id йде з поля id
        sx={{
          "--DataGrid-containerBackground": "var(--DataGrid-containerBackground) !important",
        }}
      />
    </div>
  );
};

export default UserDatatable;