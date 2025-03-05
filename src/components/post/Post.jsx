import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { Link, useLocation } from "react-router-dom";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import Comments from "../comments/Comments";
import UpdatePost from "../updatepost/UpdatePost";
import SocialProfile from "../../pages/socialprofile/SocialProfile";
import "./post.scss";

function Post({ post, userData }) {
  const location = useLocation(); // Get the current location
  // Check if the current path includes '/admin'
  const isAdmin = location.pathname.includes("/admin");
  const navigate = useNavigate();

 

  const handleNavigation = () => {
    navigate(isAdmin ? `/admin/social-profile/${post.user_id}` : `/social-profile/${post.user_id}`, {
      state: { post },
    });
  };

  const [commentsCount, setCommentsCount] = useState(0);
  const [commentOpen, setCommentOpen] = useState(false);
  const [isOpen, setOpen] = useState(false);

  const liked = false;

  useEffect(() => {
    axiosInstance
      .get(`comments/count?postId=${post.id}`)
      .then((response) => {
        setCommentsCount(response.data.count);
      })
      .catch((error) => console.error("Error fetching comments:", error));
  }, [post.id]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/posts/${id}`);
      window.location.reload();
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  // Функція для форматування дати
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={post.user_img} alt="" />
            <div className="details">
              <span
                onClick={handleNavigation}
                style={{ cursor: "pointer", color: "inherit" }}
              >
                <span className="name">Author of the post - {post.name}</span>
              </span>

              <span className="date">{formatDate(post.created_time)}</span>
            </div>
          </div>

          {/* Показ тільки для власників посту && <= Якщо перша умова true, тоді виконується друга частина.*/}

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
                    Delete
                  </li>
                  <li className="menu_itemPost" onClick={() => setOpen(false)}>
                    Exit
                  </li>
                </ul>
              </nav>
            </div>
          )}

          {/* -------------------------------- */}
        </div>
        <div className="content">
          <p>{post.description}</p>
          <img src={post.img} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {liked ? <FavoriteOutlinedIcon /> : <FavoriteBorderOutlinedIcon />}
            12 likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {commentsCount} Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            12 Shares
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} userData={userData} />}
      </div>
      
    </div>
  );
}

export default Post;
