import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../axiosInstance";
import "./comments.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import i18n from "../../i18n";

function Comments({ postId, userData }) {
  const { t } = useTranslation();
  const location = useLocation();
  const isAdmin = location.pathname.includes("/admin");
  const userImg = userData.img;

  const [likes, setLikes] = useState({}); // { commentId: { liked: true/false, count: number } }
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
        console.error(t("comments.errorFetching"), err); // Ключ: "comments.errorFetching"
      }
    };

    if (postId) {
      fetchAllComments();
    }
  }, [postId, t]);

  const handleChange = (e) => {
    setComment((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    async function fetchLikes() {
      try {
        const response = await axiosInstance.get("/api/likes");
        if (Array.isArray(response.data)) {
          const likesData = {};

          comments.forEach((comment) => {
            const commentLikes = response.data.filter(
              (like) => like.entityId === comment.id && like.type === "comment"
            );

            likesData[comment.id] = {
              liked: commentLikes.some(
                (like) => like.fromUserId === userData.id
              ),
              count: commentLikes.length,
            };
          });

          setLikes(likesData);
        }
      } catch (error) {
        console.error(t("comments.errorFetchingLikes"), error); // Ключ: "comments.errorFetchingLikes"
      }
    }

    if (comments.length) fetchLikes();
  }, [comments, userData.id, t]);

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/comments", comment);

      if (res.status === 201) {
        const newComment = {
          id: res.data.id,
          name: userData.name,
          img: userData.img,
          description: comment.description,
          created_time: new Date().toISOString(),
        };

        setComments((prevComments) => [...prevComments, newComment]);
        setComment((prev) => ({ ...prev, description: "" }));
      }
    } catch (err) {
      console.error(t("comments.errorSending"), err); // Ключ: "comments.errorSending"
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(t("comments.confirmDelete")); // Ключ: "comments.confirmDelete"
    if (confirmed) {
      try {
        await axiosInstance.delete(`/comments/${id}`);
        setComments(comments.filter((comment) => comment.id !== id));
      } catch (err) {
        console.error(t("comments.errorDeleting"), err); // Ключ: "comments.errorDeleting"
      }
    }
  };

  const addLike = async (commentId, toUserId) => {
    try {
      const res = await axiosInstance.post(`/api/likes/`, {
        toUserId,
        fromUserId: userData.id,
        type: "comment",
        entityId: commentId,
      });

      setLikes((prev) => ({
        ...prev,
        [commentId]: {
          liked: res.data.liked,
          count: res.data.count,
        },
      }));
    } catch (err) {
      console.error(t("comments.errorLiking"), err); // Ключ: "comments.errorLiking"
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(i18n.language, options);
  };
  

  return (
    <div className="comments">
      <div className="writeComments">
        <img className="imgInputComments" src={userImg} alt="" />
        <input
          className="inputComments"
          type="text"
          placeholder={t("comments.writeComment")} // Ключ: "comments.writeComment"
          name="description"
          value={comment.description}
          onChange={handleChange}
        />
        <button onClick={handleClick}>{t("comments.send")}</button> {/* Ключ: "comments.send" */}
      </div>

      {[...comments].reverse().map((comment) => {
        const likeData = likes[comment.id] || { liked: false, count: 0 };

        return (
          <div className="commentPost" key={comment.id}>
            <img className="imgCommentator" src={comment.user_img} alt="" />
            <div className="infoComments">
              <span className="nameCommentatorCommentsPost">{comment.name}</span>
              <div className="textComments">{comment.description}</div>

              <div className="bottomComments">
                <span className="dateComments">
                  {formatDate(comment.created_time)}
                </span>
                <div
                  className="likeCommentsPost"
                  onClick={
                    comment.user_id !== userData.id
                      ? () => addLike(comment.id, comment.user_id)
                      : undefined
                  }
                  style={{
                    cursor:
                      comment.user_id !== userData.id ? "pointer" : "not-allowed",
                    opacity: comment.user_id !== userData.id ? 1 : 0.6,
                  }}
                >
                  {likeData.liked ? (
                    <FavoriteOutlinedIcon fontSize="small" />
                  ) : (
                    <FavoriteBorderOutlinedIcon fontSize="small" />
                  )}{" "}
                  {likeData.count} {t("comments.likes")} {/* Ключ: "comments.likes" */}
                </div>
                {(isAdmin || comment.user_id === userData?.id) && (
                  <button
                    className="button"
                    onClick={() => handleDelete(comment.id)}
                  >
                    {t("comments.delete")} {/* Ключ: "comments.delete" */}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Comments;