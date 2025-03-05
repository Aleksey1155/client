import React, { useState, useRef } from "react";
import Modal from "react-modal";
import "./addStory.scss";

const customStyles = {
  content: {
    top: "350px",
    left: "40%",
    right: "700px",
    bottom: "-10%",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

function AddStory() {
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
        <span onClick={openModal}>Додати нову історію</span>
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

export default AddStory;