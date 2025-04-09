import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../axiosInstance";
import "./addassignment.scss";

const AddAssignment = () => {
  const [assignment, setAssignment] = useState({
    task_id: "",
    user_id: "",
    assigned_date: "",
  });

  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchTasks = async () => {
      try {
        const res = await axiosInstance.get("/tasks"); // Додаємо завдання
        setTasks(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setAssignment((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/assignments", assignment);
      navigate("/admin/assignments");
    } catch (err) {
      console.log(err);
    }
  };

  console.log(assignment);

  return (
    <div className="addassignment">
      <div className="addassignmentContainer">
        <div className="top">
          <p className="title">New Assignment</p>
          <button className="button" onClick={handleClick}>
            Додати
          </button>
        </div>
        <div className="center">
          <div className="right">
            <form>
              <div className="formInput">
                <label>Task</label>
                <select
                  className="select"
                  name="task_id" //  task_id замість task_title
                  onChange={handleChange}
                  value={assignment.task_id || ""}
                >
                  <option value="" disabled>
                    Виберіть завдання
                  </option>
                  {tasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formInput">
                <label>Date Assignment</label>
                <input
                  className="select"
                  type="date"
                  onChange={handleChange}
                  name="assigned_date"
                />
              </div>
              <div className="formInput">
                <label>Assignment</label>
                <select
                  className="select"
                  name="user_id"
                  onChange={handleChange}
                  value={assignment.user_id || ""}
                >
                  <option value="" disabled>
                    Виберіть виконавця
                  </option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAssignment;
