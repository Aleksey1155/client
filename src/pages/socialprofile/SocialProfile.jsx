import React from "react";
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

function Profile() {
  return (
    <div className="profile">
      <div className="container">
        <div className="images">
          <img
            src="https://images.pexels.com/photos/13440765/pexels-photo-13440765.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt=""
            className="cover"
          />
          <img
            src="https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
            alt=""
            className="profilePic"
          />
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
              <span>User name</span>
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
        <Posts/>
      </div>
      <GeneralChat/>
    </div>
  );
}

export default Profile;
