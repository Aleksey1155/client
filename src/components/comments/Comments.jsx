import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";
import "./comments.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";

function Comments({ postId, userData }) {
  const userImg = userData.img;
  const liked = false;

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
  console.log(comments);
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
      <div className="writeComments">
        <img className="imgInputComments" src={userImg} alt="" />
        <input
          className="inputComments"
          type="text"
          placeholder="Write a comment"
          name="description"
          value={comment.description}
          onChange={handleChange}
        />
        <button onClick={handleClick}>Send</button>
      </div>

      {[...comments].reverse().map((comment) => (
        <div className="commentPost" key={comment.id}>
          <img className="imgCommentator" src={comment.user_img} alt="" />
          <div className="infoComments">
            <span className="nameCommentatorCommentsPost">{comment.name}</span>
            <div className="textComments">{comment.description}</div>

            <div className="bottomComments">
              <span className="dateComments">
                {formatDate(comment.created_time)}
              </span>
              <div className="likeCommentsPost">
                {liked ? (
                  <FavoriteOutlinedIcon fontSize="small" />
                ) : (
                  <FavoriteBorderOutlinedIcon fontSize="small" />
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Comments;
