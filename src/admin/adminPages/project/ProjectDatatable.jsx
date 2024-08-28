import "./projectdatatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


// Функція для форматування дати
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(); // Форматування дати в локальному форматі
};

const projectColumns = [
  { field: "title", headerName: "Task Title", width: 200 },
 
  {
    field: "task.start_date",
    headerName: "Start Date",
    width: 120,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          
          {formatDate(params.row.start_date)}
        </div>
      );
    } // Форматування дати для start_date
  },
  {
    field: "task.end_date",
    headerName: "End Date",
    width: 120,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          
          {formatDate(params.row.end_date)}
        </div>
      );
    } // Форматування дати для end_date
  },
   { field: "priority_name", headerName: "Priority", width: 120 },
  { field: "status_name", headerName: "Status", width: 120 },
];

const ProjectDatatable = ({ projectId }) => {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskStatuses, setTaskStatuses] = useState([]);
  const [taskPriorities, setTaskPriorities] = useState([]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/projects/${projectId}`
        );
        setProject(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchAllTasks = async () => {
      try {
        const res = await axios.get("http://localhost:3001/tasks");
        setTasks(
          res.data.filter((task) => task.project_id === Number(projectId))
        );
      } catch (err) {
        console.log(err);
      }
    };

    const fetchTaskStatuses = async () => {
      try {
        const res = await axios.get("http://localhost:3001/task_statuses");
        setTaskStatuses(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchTaskPriorities = async () => {
      try {
        const res = await axios.get("http://localhost:3001/task_priorities");
        setTaskPriorities(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProject();
    fetchAllTasks();
    fetchTaskStatuses();
    fetchTaskPriorities();
  }, [projectId]);

  

  const truncateDescription = (description, maxLength) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "...";
    }
    return description;
  };

  const handleDelete = async (taskId) => {
    const confirmed = window.confirm(
      "Ви впевнені, що хочете видалити це завдання?"
    );
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:3001/tasks/${taskId}`);
        setTasks(tasks.filter((task) => task.id !== taskId));
      } catch (err) {
        console.log(err);
      }
    }
  };

  if (!project) {
    return <div>Loading...</div>;
  }

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
              to={`/tasks/${params.row.id}`}
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



  return (
    <div className="projectDatatable">
     
      <div className="projectTitle">Project Tasks</div>

      <div className="datatable">
          <DataGrid
            className="datagrid"
            rows={tasks}
           columns={projectColumns.concat(actionColumn)}
            pageSize={9}
            rowsPerPageOptions={[9]}
            checkboxSelection
            getRowId={(row) => row.id} // Вказуємо, що id йде з поля id
          />
        </div>
     
    </div>
  );
};

export default ProjectDatatable;
