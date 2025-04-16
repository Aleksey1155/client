import React, { useState, useRef } from "react";
import Modal from "react-modal";
import axiosInstance from "../../axiosInstance";
import "./story.scss";

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
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)", // Темний прозорий фон
    zIndex: 1000,
  },
};

Modal.setAppElement("#root");

function Story() {
    let subtitle;
    const [modalIsOpen, setIsOpen] = useState(false);
  
  
    function openModal() {
      setIsOpen(true);
    }
  
    function afterOpenModal() {
      subtitle.style.color = "#555";
    }
  
    function closeModal() {
      setIsOpen(false);
      setMultiplier1("");
      setMultiplier2("");
      setResult("");
    }
  
    
  
    return (
      <div className="userProfile">
        <div className="containerUserProfile">
          <span onClick={openModal}>Add New Story</span>
          <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Приклад модального вікна"
          >
            <span
              className="welcomeUserProfile"
              ref={(_subtitle) => (subtitle = _subtitle)}
            >
             
            </span>
            
          </Modal>
        </div>
      </div>
    );
}

export default Story
