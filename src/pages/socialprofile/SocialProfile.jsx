import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { useLocation } from "react-router-dom";
import "./socialProfile.scss";
import FacebookIcon from "@mui/icons-material/Facebook";
import PinterestIcon from "@mui/icons-material/Pinterest";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import GeneralChat from "../../components/generalchat/GeneralChat";
import Posts from "../../components/posts/Posts";

function SocialProfile() {
  const location = useLocation();
  const post = location.state?.post; // Отримуємо post

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Додано стан завантаження
  const navigate = useNavigate();
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {

          const response = await axiosInstance.get("/me");

          setUserData(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false);
        }
      };
  
      fetchUserData();
    }, [navigate]);
  
    if (loading) {
      return <div>Loading...</div>; // Можна відобразити спіннер або повідомлення про завантаження
    }
  
    if (!userData) {
      return <div>No user data available.</div>; // Повідомлення, якщо дані користувача відсутні
    }

  // console.log(userData);

  return (
    <div className="profile">
      <div className="container">
        <div className="images">
          <img
            src="https://images.pexels.com/photos/13440765/pexels-photo-13440765.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt=""
            className="cover"
          />
          <img src={post.user_img} alt="" className="profilePic" />
        </div>
        <div className="profileContainer">
          <div className="userInfo">
            <div className="left">
              <a href="http://facebook.com">
                <FacebookIcon fontSize="large" />
              </a>
              <a href="http://facebook.com">
                <InstagramIcon fontSize="large" />
              </a>
              <a href="http://facebook.com">
                <TwitterIcon fontSize="large" />
              </a>
              <a href="http://facebook.com">
                <PinterestIcon fontSize="large" />
              </a>
            </div>
            <div className="center">
              <span>{post.name}</span>

              <div className="info">
                <div className="item">
                  <PlaceIcon />
                  <span>USA</span>
                </div>
                <div className="item">
                  <LanguageIcon />
                  <span>User</span>
                </div>
              </div>
              <button>Follow</button>
            </div>
            <div className="right">
              <MailOutlineIcon />
              <MoreVertIcon />
            </div>
          </div>
        </div>
        <Posts userData = {userData} />
      </div>
      <GeneralChat />
    </div>
  );
}

export default SocialProfile;
