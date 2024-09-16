import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';
import "./calendarModal.scss"

const localizer = momentLocalizer(moment);

const CalendarModal = ({ tasks }) => {
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
      <span className='calendarButton' onClick={openModal}>Calendar</span>

      {/* Модальне вікно */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Календар">
        <span className='title'>Oll tasks</span>
        <button className='close' onClick={closeModal}>Закрити</button>

        {/* Календар */}
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, width: '100%' }}
        />
      </Modal>
    </div>
  );
};

export default CalendarModal;
