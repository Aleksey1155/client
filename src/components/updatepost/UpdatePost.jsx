import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import config from "../../config";
import Modal from "react-modal";
import "./updatePost.scss";

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

function UpdatePost({ post, userData }) {
  // console.log(userData)
  // console.log(post)

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState({
    description: "",
    img: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploaded, setUploaded] = useState();

  const navigate = useNavigate();
  const filePicker = useRef(null);

  useEffect(() => {
    if (post) {
      setPosts({ description: post.description, img: post.img });
    }
  }, [post]);

  const handleChange = (e) => {
    setPosts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.put(`/posts/${post.id}`, posts);
      window.location.reload();
    } catch (err) {
      console.error("Помилка при оновленні поста:", err);
    }
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("files", selectedFile);
    formData.append("postId", post.id); // Передаємо post.id на сервер

    try {
      const res = await fetch(`${config.baseURL}/upload_post`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Server Response:", data); // Додано для перевірки

      setUploaded(data);

      window.location.reload();
    } catch (error) {
      console.error("Upload error:", error);
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
    <div className="updatePost">
      <div className="containerUpdatePost">
        <span onClick={openModal}>Edit</span>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <span
            className="welcomeUpdatePost"
            ref={(_subtitle) => (subtitle = _subtitle)}
          >
            {userData ? `Welcome, ${userData.name}!` : "Loading..."}
          </span>

          <div className="topContainerUpdatePost">
            <button className="closeUpdatePost" onClick={closeModal}>
              close
            </button>
            <span className="listTextUpdatePost">Edit your Post</span>
            <button className="editUpdatePost" onClick={handleClick}>
              Edit Post
            </button>
          </div>

          {/* ПОЧАТОК Додавання зображення  */}

          <div className="centerUpdatePost">
            <div className="topUpdatePost">
              <p className="titleUpdatePost">Update image</p>
            </div>
            <div className="bottomUpdatePost">
              <div className="leftUpdatePost">
                <div>
                  <button onClick={handlePick}>Add file</button>
                  <input
                    className="hiddenUpdatePost"
                    ref={filePicker}
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*, .png, .jpg, .web"
                  />
                  <button onClick={handleUpload}>Upload now!</button>
                </div>

                {!selectedFile && (
                  <img className="noimageUpdatePost" src={posts.img} alt="" />
                )}

                {selectedFile && !uploaded && (
                  <div className="selectedFileUpdatePost">
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
                        className="image-previewUpdatePost"
                      />
                    </div>
                  </div>
                )}

                {uploaded?.uploadedFiles?.length > 0 && (
                  <div>
                    <h2>{uploaded.uploadedFiles[0].fileName}</h2>
                    <img
                      className="imagUpdatePost"
                      src={uploaded.uploadedFiles[0].filePath}
                      alt=""
                    />
                  </div>
                )}
              </div>

              {/* КІНЕЦЬ Додавання зображення  */}
            </div>
            <div className="textareaUpdatePost">
              <textarea
                type="text"
                placeholder="description"
                onChange={handleChange}
                name="description"
                value={posts.description}
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default UpdatePost;
