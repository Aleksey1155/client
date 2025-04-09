import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../axiosInstance";
import { DateTime } from "luxon";
import "./updateassignment.scss";

const UpdateAssignment = () => {
  const [assignment, setAssignment] = useState({
    task_id: "", // Зберігаємо task_id
    user_id: "",
    assigned_date: "",
  });

  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]); // Додано для завдань
  const navigate = useNavigate();
  const { id: assignmentId } = useParams();

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await axiosInstance.get(`/assignments/${assignmentId}`);
        const assignmentData = res.data;
        setAssignment({
          task_id: assignmentData.task_id || "", // Зберігаємо task_id
          user_id: assignmentData.user_id || "",
          assigned_date: assignmentData.assigned_date
            ? DateTime.fromISO(assignmentData.assigned_date).toISODate()
            : "",
        });
      } catch (err) {
        console.log(err);
      }
    };

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

    fetchAssignment();
    fetchUsers();
    fetchTasks();
  }, [assignmentId]);

  const handleChange = (e) => {
    setAssignment((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put("/assignments/" + assignmentId, assignment);
      navigate("/admin/assignments");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="updateassignment">
      <div className="updateassignmentContainer">
        <div className="top">
          <p className="title">Update Assignment</p>
          <button className="button" onClick={handleClick}>
            Редагувати
          </button>
        </div>
        <div className="bottom">
          <div className="left"></div>
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

              <div
                className="formInput"
                onClick={(e) =>
                  e.currentTarget.querySelector("input").showPicker()
                }
              >
                <label>Date Assignment</label>
                <input
                  className="inputDate"
                  type="date"
                  onChange={handleChange}
                  name="assigned_date"
                  value={assignment.assigned_date || ""}
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

export default UpdateAssignment;
