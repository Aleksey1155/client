import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';
import "./calendarModal.scss"

const localizer = momentLocalizer(moment);

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    backgroundColor: "var(--block-bg) !important", // Темний фон
    color: "var(--header-tex) !important", // Білий текст
    border: "1px solid #444", // Темна рамка
    borderRadius: "10px",
    padding: "20px",
    transform: "translate(-50%, -50%)",
     width: "1000px", 
    maxWidth: "90vw"
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)", // Темний прозорий фон
    zIndex: 1000,
  },
};

const CalendarModal = ({ tasks }) => {
  const { t, i18n } = useTranslation();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Події для календаря
  const events = tasks.map((task) => {
    const endDate = new Date(task.task_end_date);
    endDate.setDate(endDate.getDate() + 1); // Додаємо один день до дати закінчення
    return {
      title: task.task_title,
      start: new Date(task.task_start_date),
      end: endDate,  
    };
  });
  
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className='calendarModal'>
      {/* Кнопка для відкриття модального вікна */}
      <span className='calendarButton' onClick={openModal}>{t("calendar")}</span>

      {/* Модальне вікно */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} contentLabel="Календар">
        <span className='title'>{t("allTasks")}</span>
        <button className='close' onClick={closeModal}>{t("close")}</button>

        {/* Календар */}
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, width: '100%' }} // тут можна додати колір тексту в календарі?
        />
      </Modal>
    </div>
  );
};

export default CalendarModal;
