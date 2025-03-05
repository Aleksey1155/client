import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";
import "./comments.scss";

function Comments({ postId, userData }) {

  
  const userImg = userData.img;

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState({
    description: "",
    post_id: postId,
    user_id: userData.id,
  });

  useEffect(() => {
    const fetchAllComments = async () => {
      try {
        const res = await axiosInstance.get(`/comments?postId=${postId}`);
        setComments(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (postId) {
      fetchAllComments();
    }
  }, [postId]);

  const handleChange = (e) => {
    setComment((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/comments", comment);
      
      if (res.status === 201) {
        // Додаємо новий коментар до списку без перезавантаження сторінки
        const newComment = {
          id: res.data.id, // Переконайтеся, що сервер повертає ID
          name: userData.name,
          img: userData.img,
          description: comment.description,
          created_time: new Date().toISOString(), // Локальна дата для відображення
        };
        
        setComments((prevComments) => [...prevComments, newComment]); 

        // Очищуємо поле вводу після додавання коментаря
        setComment((prev) => ({ ...prev, description: "" }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Функція для форматування дати
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={userImg} alt="" />
        <input
          type="text"
          placeholder="Write a comment"
          name="description"
          value={comment.description}
          onChange={handleChange}
        />
        <button onClick={handleClick}>Send</button>
      </div>

      
      {[...comments].reverse().map((comment) => (
        <div className="comment" key={comment.id}>
          <img src={comment.img} alt="" />
          <div className="info">
            <span>{comment.name}</span>
            <p>{comment.description}</p>
          </div>
          <span className="date">{formatDate(comment.created_time)}</span>
        </div>
      ))}
    </div>
  );
}

export default Comments;


