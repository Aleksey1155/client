import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import "./userdetails.scss";
import UserDatatable from "./UserDatatable";

const UserDetails = () => {
  const [user, setUser] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/users/${id}`);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, [id]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="userdetails">
      <div className="userContainer">
        <div className="top">
          <div className="left">
            <div className="edit">
              <Link to={`/update_user/${user.id}`} className="update">
                EditUser
              </Link>
            </div>
            <h1 className="title">Information</h1>
            <div className="item">
              <img src={user.img} alt="" className="itemImg" />
              <div className="details">
                <div className="itemTitle">{user.name}</div>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{user.email}</span>
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">{user.phone}</span>
                  <span className="itemKey">Role:</span>
                  <span className="itemValue">{user.role_name}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="title">Description written by admin</div>
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
