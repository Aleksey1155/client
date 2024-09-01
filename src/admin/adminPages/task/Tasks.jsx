import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import "./tasks.scss";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const projectColumns = [
  //   { field: "orderNumber", headerName: "N", width: 12 }, // Колонка з порядковим номером
  {
    field: "image_url",
    headerName: "Image",
    width: 80,
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
    field: "title",
    headerName: "Task Title",
    width: 200,
  },
  {
    field: "project_title",
    headerName: "Project Title",
    width: 150,
  },
  {
    field: "start_date",
    headerName: "Start Date",
    width: 100,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">{formatDate(params.row.start_date)}</div>
      );
    },
  },
  {
    field: "end_date",
    headerName: "End Date",
    width: 100,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">{formatDate(params.row.end_date)}</div>
      );
    },
  },
  {
    field: "status_name",
    headerName: "Status",
    width: 100,
  },
  {
    field: "priority_name",
    headerName: "Priority",
    width: 80,
  },
];

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  // const [taskStatuses, setTaskStatuses] = useState([]);
  // const [taskPriorities, setTaskPriorities] = useState([]);
  // const [selectedStatus, setSelectedStatus] = useState("");
  // const [selectedPriority, setSelectedPriority] = useState("");

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const res = await axios.get("http://localhost:3001/tasks");
        console.log(res.data);
        setTasks(sortTasks(res.data));
      } catch (err) {
        console.log(err);
      }
    };

    // const fetchTaskStatuses = async () => {
    //   try {
    //     const res = await axios.get("http://localhost:3001/task_statuses");
    //     setTaskStatuses(res.data);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };

    // const fetchTaskPriorities = async () => {
    //   try {
    //     const res = await axios.get("http://localhost:3001/task_priorities");
    //     setTaskPriorities(res.data);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };

    fetchAllTasks();
    // fetchTaskStatuses();
    // fetchTaskPriorities();
  }, []);

  const sortTasks = (tasks) => {
    return tasks.sort((a, b) => {
      if (a.project_id !== b.project_id) {
        return a.project_id - b.project_id;
      }
      if (a.id !== b.id) {
        return a.id - b.id;
      }
      if (a.priority_name !== b.priority_name) {
        return a.priority_name.localeCompare(b.priority_name);
      }
      if (a.status_name !== b.status_name) {
        return a.status_name.localeCompare(b.status_name);
      }
      return new Date(a.start_date) - new Date(b.start_date);
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Ви впевнені, що хочете видалити цей проект?"
    );
    if (confirmed) {
      try {
        await axios.delete("http://localhost:3001/tasks/" + id);
        setTasks(sortTasks(tasks.filter((task) => task.id !== id)));
      } catch (err) {
        console.log(err);
      }
    }
  };

  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "numeric", day: "numeric" };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };

  // const filteredTasks = tasks.filter((task) => {
  //   const statusMatch = selectedStatus
  //     ? task.status_name === selectedStatus
  //     : true;
  //   const priorityMatch = selectedPriority
  //     ? task.priority_name === selectedPriority
  //     : true;
  //   return statusMatch && priorityMatch;
  // });
  // const truncateDescription = (description, maxLength) => {
  //   if (description.length > maxLength) {
  //     return description.substring(0, maxLength) + "...";
  //   }
  //   return description;
  // };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 180,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {/* Link with dynamic routing */}
            <Link
              to={`/admin/task/${params.row.id}`}
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
    <div className="tasks">
      <div className="datatableTitle">
        Tasks
        <Link to="/admin/add_task" className="link">
          Add New
        </Link>
      </div>
      <div className="dataGrid">
        <DataGrid
          className="datagrid"
          rows={tasks}
          columns={projectColumns.concat(actionColumn)} // Колонка `id` не включена
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
          initialState={{
            sorting: {
              sortModel: [{ field: "orderNumber", sort: "desc" }], // Сортування за порядковим номером
            },
          }}
        />
      </div>
    </div>
  );
};

export default Tasks;
