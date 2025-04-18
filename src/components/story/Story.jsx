import React from "react";
import Modal from "react-modal";
import "./story.scss";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    backgroundColor: "#1e1e1e",
    color: "#fff",
    borderRadius: "10px",
    padding: "0",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "600px",
    overflow: "hidden",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
  },
};

Modal.setAppElement("#root");

function Story({ isOpen, onClose, story }) {
  if (!story) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Story Modal"
    >
      <div className="storyModal">
        
        <div className="videoWrapper">
          <video src={story.video} controls autoPlay style={{ width: "100%" }} />
        </div>
        <div className="descriptionWrapper">
          <p>{story.description || "No description provided."}</p>
        </div>
        <button className="closeBtn" onClick={onClose}>✖</button>
      </div>
    </Modal>
  );
}

export default Story;
