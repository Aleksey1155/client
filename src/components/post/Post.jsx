import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../axiosInstance";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import Comments from "../comments/Comments";
import UpdatePost from "../updatepost/UpdatePost";
import SocialProfile from "../../pages/socialprofile/SocialProfile";
import "./post.scss";
import i18n from "../../i18n";

function Post({ post, userData }) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.includes("/admin");

  const [commentsCount, setCommentsCount] = useState(0);
  const [commentOpen, setCommentOpen] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const commentRef = useRef();

  const handleNavigation = () => {
    navigate(
      isAdmin
        ? `/admin/social-profile/${post.user_id}`
        : `/social-profile/${post.user_id}`,
      {
        state: { post },
      }
    );
  };

  useEffect(() => {
    axiosInstance
      .get(`comments/count?postId=${post.id}`)
      .then((response) => {
        setCommentsCount(response.data.count);
      })
      .catch((error) => console.error(t("post.errorFetchingComments"), error)); // Ключ: "post.errorFetchingComments"
  }, [post.id, t]);

  useEffect(() => {
    async function fetchLikes() {
      try {
        const response = await axiosInstance.get("/api/likes");
        if (Array.isArray(response.data)) {
          const postLikes = response.data.filter(
            (like) => like.entityId === post.id && like.type === "post"
          );
          setLikesCount(postLikes.length);
          const isLiked = postLikes.some(
            (like) => like.fromUserId === userData.id
          );
          setLiked(isLiked);
        }
      } catch (error) {
        console.error(t("post.errorFetchingLikes"), error); // Ключ: "post.errorFetchingLikes"
        setLikesCount(0);
        setLiked(false);
      }
    }

    fetchLikes();
  }, [post, userData.id, t]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        commentOpen &&
        commentRef.current &&
        !commentRef.current.contains(event.target)
      ) {
        setCommentOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [commentOpen]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      t("post.confirmDelete") // Ключ: "post.confirmDelete"
    );
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/posts/${id}`);
      window.location.reload();
    } catch (err) {
      console.error(t("post.errorDeletingPost"), err); // Ключ: "post.errorDeletingPost"
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(i18n.language, options);
  };
  

  const addLike = async () => {
    try {
      const res = await axiosInstance.post(`/api/likes/`, {
        toUserId: post.user_id,
        fromUserId: userData.id,
        type: "post",
        entityId: post.id,
      });
      setLiked(res.data.liked);
      setLikesCount(res.data.count);
    } catch (err) {
      console.error(t("post.errorLiking"), err); // Ключ: "post.errorLiking"
    }
  };

  return (
    <div className="post">
      <div className="containerPost">
        <div className="user">
          <div className="userInfo">
            <img src={post.user_img} alt="" />
            <div className="details">
              <span
                onClick={handleNavigation}
                style={{ cursor: "pointer", color: "inherit" }}
              >
                <span className="name">
                  {t("post.author")} - {post.name} {/* Ключ: "post.author" */}
                </span>
              </span>
              <span className="date">{formatDate(post.created_time)}</span>
            </div>
          </div>

          {(isAdmin || post.user_id === userData?.id) && (
            <div className="menuPost">
              <MoreHorizOutlinedIcon onClick={() => setOpen(!isOpen)} />
              <nav className={`navPost ${isOpen ? "active" : ""}`}>
                <ul className="menuListPost">
                  <li className="menu_itemPost">
                    <UpdatePost post={post} userData={userData} />
                  </li>
                  <li
                    className="menu_itemPost"
                    onClick={() => handleDelete(post.id)}
                  >
                    {t("post.delete")} {/* Ключ: "post.delete" */}
                  </li>
                  <li className="menu_itemPost" onClick={() => setOpen(false)}>
                    {t("post.exit")} {/* Ключ: "post.exit" */}
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
        <div className="contentPost">
          <p>{post.description}</p>
          <img src={post.img} alt="" />
        </div>
        <div className="info">
          <div
            className="item"
            onClick={post.user_id !== userData.id ? addLike : undefined}
            style={{
              cursor: post.user_id !== userData.id ? "pointer" : "not-allowed",
              opacity: post.user_id !== userData.id ? 1 : 0.6,
            }}
          >
            {liked ? <FavoriteOutlinedIcon /> : <FavoriteBorderOutlinedIcon />}
            {likesCount} {t("post.likes")} {/* Ключ: "post.likes" */}
          </div>

          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {commentsCount} {t("post.comments")} {/* Ключ: "post.comments" */}
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            12 {t("post.shares")} {/* Ключ: "post.shares" */}
          </div>
        </div>
        {commentOpen && (
          <div ref={commentRef}>
            <Comments postId={post.id} userData={userData} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;