import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../axiosInstance";
import "./social.scss";
import Stories from "../../components/stories/Stories";
import Posts from "../../components/posts/Posts";
import GeneralChat from "../../components/generalchat/GeneralChat";

function Social() {
   const { t } = useTranslation();
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
    return (
      <div className="social">
        
        <div className="containerSocial">
        <span className="title">{t("socialPage")}</span>
          <Stories userData = {userData} />
          {/* <Posts userData = {userData} /> */}
       
        
        </div>
          {/* <GeneralChat userData = {userData} /> */}
          
        </div>
      
   
    );
}

export default Social
