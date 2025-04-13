import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import config from "../../config";
import Modal from "react-modal";
import "./addPost.scss";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    backgroundColor: "var(--header-bg) !important", // Темний фон
    color: "#ffffff", // Білий текст
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


// const customStyles = {
//   content: {
//     top: "350px",
//     left: "40%",
//     right: "700px",
//     bottom: "-10%",
//     marginRight: "-50%",
//     transform: "translate(-50%, -50%)",
//   },
// };

Modal.setAppElement("#root");



function AddPost({ userData }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploaded, setUploaded] = useState();

  const navigate = useNavigate();
  const filePicker = useRef(null);
  const [post, setPost] = useState({
    description: "",
    img: "",
    user_id: userData?.id || null, // Додаємо перевірку
  });

  const handleChange = (e) => {
    setPost((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleClick = async (e) => {
    e.preventDefault();
  
    try {
      // 1. Додаємо пост
      const postRes = await axiosInstance.post(`/posts`, post);
      const postId = postRes.data.insertId; // Отримуємо ID нового посту з відповіді сервера
      console.log(postId);
  
      // 2. Якщо вибрано файли, додаємо їх
      if (selectedFile) {
        const formData = new FormData();
        formData.append("files", selectedFile);
        formData.append("postId", postId); // Передаємо postId на сервер
  
        const res = await axiosInstance.post("/upload_post", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
  
        const data = res.data;
        console.log("Uploaded files:", data.uploadedFiles);
  
        if (data.uploadedFiles) {
          setUploaded(data.uploadedFiles);
        }
      }
  
      // Після успішного додавання посту та зображення перезавантажуємо сторінку
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("An error occurred while adding the post.");
    }
  };
  

  const handlePick = () => {
    filePicker.current.click();
  };

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
  }
  return (
    <div className="addPost">
      <div className="containerAddPost">
        <span onClick={openModal}>Add New Post</span>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <span
            className="welcomeAddPost"
            ref={(_subtitle) => (subtitle = _subtitle)}
          >
            {userData ? `Welcome, ${userData.name}!` : "Loading..."}
          </span>

          <div className="topContainerAddPost">
            <button className="closeAddPost" onClick={closeModal}>
              close
            </button>
            <span className="listTextAddPost">Add your Post</span>
            <button className="editAddPost" onClick={handleClick}>
              Add Post
            </button>
          </div>

          {/* ПОЧАТОК Додавання зображення  */}
          <div className="leftAddPost">
            <div>
              <button className="buttonAddFile" onClick={handlePick}>Add file</button>
              <input
                className="hidden"
                ref={filePicker}
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>

            {!selectedFile && (
              <img
                className="noimageAddPost"
                src="https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                alt=""
              />
            )}

            {selectedFile && !uploaded && (
              <div className="selectedFileAddPost">
                <div>
                  <ul>
                    <li>Name: {selectedFile.name}</li>
                    <li>Type: {selectedFile.type}</li>
                    <li>Size: {selectedFile.size}</li>
                  </ul>
                </div>
                <div>
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="image-preview"
                  />
                </div>
              </div>
            )}

            {uploaded && uploaded.uploadedFiles.length > 0 && (
              <div>
                <h2>{uploaded.uploadedFiles[0].fileName}</h2>
                <img
                  className="image"
                  src={uploaded.uploadedFiles[0].filePath}
                  alt=""
                />
              </div>
            )}
          </div>

           {/* КІНЕЦЬ Додавання зображення  */}

        

          <div className="rightAddPost">
          
              
                <textarea className="textarea"
                  type="text"
                  placeholder="write a post"
                  onChange={handleChange}
                  name="description"
                />
              
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default AddPost;
