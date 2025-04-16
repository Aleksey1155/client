import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../../axiosInstance";
import "./userdetails.scss";
import UserDatatable from "./UserDatatable";
import { useTranslation } from "react-i18next";

const UserDetails = () => {
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/users/${id}`);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, [id]);

  if (!user) {
    return <div>{t("userdetails.loading")}...</div>; // Ключ: "userdetails.loading"
  }

  return (
    <div className="userdetails">
      <div className="userContainer">
        <div className="top">
          <div className="left">
            <div className="edit">
              <Link to={`/admin/update_user/${user.id}`} className="update">
                {t("userdetails.editUser")} {/* Ключ: "userdetails.editUser" */}
              </Link>
            </div>
            <h1 className="title">{t("userdetails.information")}</h1> {/* Ключ: "userdetails.information" */}
            <div className="item">
              <img src={user.img} alt={user.name} className="itemImg" />
              <div className="details">
                <div className="itemTitle">{user.name}</div>
                <div className="detailItem">
                  <span className="itemKey">{t("userdetails.email")}:</span> {/* Ключ: "userdetails.email" */}
                  <span className="itemValue">{user.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">{t("userdetails.phone")}:</span> {/* Ключ: "userdetails.phone" */}
                  <span className="itemValue">{user.phone}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">{t("userdetails.role")}:</span> {/* Ключ: "userdetails.role" */}
                  <span className="itemValue">{user.job_name}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="title">{t("userdetails.descriptionTitle")}</div> {/* Ключ: "userdetails.descriptionTitle" */}
            <div className="descr">{user.descr}</div>
          </div>
        </div>
        <div className="bottom">
          {/* Передаєм id в UserDatatable!!!!!!!!!!!!!!!!! */}
          <UserDatatable userId={id} />
        </div>
      </div>
    </div>
  );
};

export default UserDetails;