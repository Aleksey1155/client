import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";
import "./kanban.scss";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    width: "1150px",
    height: "600px",
    backgroundColor: "var(--block-bg) !important", // Темний фон
    color: "var(--header-tex) !important", // Білий текст
    border: "1px solid #444", // Темна рамка
    borderRadius: "10px",
    padding: "20px",
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)", // Темний прозорий фон
    zIndex: 1000,
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");

function Kanban({ userId }) {
  const { t, i18n } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [addtask, setAddtask] = useState({
    user_id: userId || "", // Додаємо перевірку на випадок undefined
    task_description: "",
  });

  useEffect(() => {
    setAddtask((prev) => ({ ...prev, user_id: userId })); // Додаємо user_id у стан

    const fetchAllTasks = async () => {
      try {
        const res = await axiosInstance.get(`/kanban/${userId}`);

        setTasks(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    //setAddtask((prev) => ({ ...prev, user_id: userId }));

    fetchAllTasks();
  }, [userId]);

  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#555";
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleDeleteTask = async (id) => {
    const confirmed = window.confirm(
      "Ви впевнені, що хочете видалити цей Task?"
    );
    if (confirmed) {
      try {
        await axiosInstance.delete(`/kanban/${id}`);
        setTasks(tasks.filter((task) => task.id !== id));
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleChange = (e) => {
    setAddtask((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!addtask.task_description.trim()) {
      alert("Поле завдання не може бути порожнім!");
      return;
    }

    if (!addtask.user_id) {
      console.error("Помилка: user_id не визначено!");
      return;
    }

    try {
      await axiosInstance.post("/kanban", addtask);
      const res = await axiosInstance.get(`/kanban/${userId}`);
      setTasks(res.data);
      setAddtask((prev) => ({ ...prev, task_description: "" })); // Очищуємо лише поле завдання
    } catch (err) {
      console.log("Error while adding task:", err);
    }
  };

  const handleDeleteKanban = async (userId) => {
    const confirmed = window.confirm(
      "Ви впевнені, що хочете видалити цей Kanban?"
    );
    if (confirmed) {
      try {
        await axiosInstance.delete(`/delkanban/${userId}`);
        // Оновити стан tasks після видалення Kanban
        setTasks([]);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const changeTaskStatus = async (id, newStatus) => {
    try {
      await axiosInstance.put(`/kanban/${id}`, {
        status: newStatus,
      });
      const res = await axiosInstance.get(`/kanban/${userId}`);
      setTasks(res.data);
    } catch (err) {
      console.log("Error while changing task status:", err);
    }
  };

  return (
    <div className="kanban">
      <div className="containerKanban">
        <span onClick={openModal}>{t("kanban")}</span>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}>TODO LIST</h2>
          <div className="top">
            <button className="close" onClick={closeModal}>
              {t("close")}
            </button>
            <span className="listText">{t("ToDoListForSimpleUserTasks")}</span>
          </div>
          <div className="centerTodo">
            {/* TODO column */}
            <div className="todo">
              <span className="titleTodo">ToDo</span>
              <div className="list">
                {tasks
                  .filter((task) => task.status === "ToDo")
                  .map((task) => (
                    <div key={task.id} className="task">
                      <div className="task_description">
                        <div className="topTaskDescription">
                          <RemoveCircleOutlineOutlinedIcon
                            className="iconDel"
                            onClick={() => handleDeleteTask(task.id)}
                          />
                          <div className="text_description">
                            {task.task_description}
                          </div>
                        </div>
                        {/* Button to move task to Doing */}
                        <button
                          className="doingButt"
                          onClick={() => changeTaskStatus(task.id, "Doing")}
                        >
                          {t("moveTo")} Doing
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Doing column */}
            <div className="doing">
              <span className="titleDoing">Doing</span>
              <div className="list">
                {tasks
                  .filter((task) => task.status === "Doing")
                  .map((task) => (
                    <div key={task.id} className="task">
                      <div className="task_description">
                        <div className="topTaskDescription"> 
                          <RemoveCircleOutlineOutlinedIcon
                            className="iconDel"
                            onClick={() => handleDeleteTask(task.id)}
                          />
                          <div className="text_description">
                            {task.task_description}
                          </div>
                        </div>
                        {/* Button to move task back to TODO */}
                        <button
                          className="todoButt"
                          onClick={() => changeTaskStatus(task.id, "ToDo")}
                        >
                          {t("moveTo")} ToDo
                        </button>
                        {/* Button to move task to Done */}
                        <button
                          className="doneButt"
                          onClick={() => changeTaskStatus(task.id, "Done")}
                        >
                          {t("moveTo")} Done
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Done column */}
            <div className="done">
              <span className="titleDone">Done</span>
              <div className="list">
                {tasks
                  .filter((task) => task.status === "Done")
                  .map((task) => (
                    <div key={task.id} className="task">
                      <div className="task_description">
                        <div className="topTaskDescription">
                          <RemoveCircleOutlineOutlinedIcon
                            className="iconDel"
                            onClick={() => handleDeleteTask(task.id)}
                          />
                          <div className="text_description">
                            {task.task_description}
                          </div>
                        </div>
                        {/* Button to move task back to Doing */}
                        <button
                          className="todoButt"
                          onClick={() => changeTaskStatus(task.id, "Doing")}
                        >
                          {t("moveTo")} Doing
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <form onSubmit={(e) => e.preventDefault()}>
            <textarea
              className="textarea"
              type="text"
              placeholder={t("taskText")}
              onChange={handleChange}
              name="task_description"
              value={addtask.task_description} // Додаємо значення поля
            />
            <button className="addTask" onClick={handleClick}>
              {t("addTask")}
            </button>
            <button
              className="deleteKanban"
              onClick={() => handleDeleteKanban(userId)}
            >
              {t("deleteKanban")}
            </button>
          </form>
        </Modal>
      </div>
    </div>
  );
}

export default Kanban;
