import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./updateuser.scss";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";

const UpdateUser = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    img: "",
    descr: "",
    role_id: "",
  });

  const [roles, setRoles] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get("http://localhost:3001/roles");
        setRoles(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/users/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRoles();
    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:3001/users/" + userId, user);
      navigate("/users");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="updateuser">
      <div className="updateuserContainer">
        <div className="top">
          <p className="title">Update user</p>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              className="image"
              src={user.img}
              alt=""
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  {" "}
                  Image:
                  <FolderOpenOutlinedIcon className="icon" />
                </label>
                <input type="file" id="file" style={{ display: "none" }} />
              </div>

              <div className="formInput">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="name"
                  onChange={handleChange}
                  name="name"
                  value={user.name}
                />
              </div>

              <div className="formInput">
                <label>Email</label>
                <input
                  type="text"
                  placeholder="email"
                  onChange={handleChange}
                  name="email"
                  value={user.email}
                />
              </div>
              <div className="formInput">
                <label>Password</label>
                <input
                  type="text"
                  placeholder="password"
                  onChange={handleChange}
                  name="password"
                  value={user.password}
                />
              </div>
              <div className="formInput">
                <label>Phone</label>
                <input
                  type="text"
                  placeholder="phone"
                  onChange={handleChange}
                  name="phone"
                  value={user.phone}
                />
              </div>

              <div className="formInput">
                <label>Photo</label>
                <input
                  type="text"
                  placeholder="photo"
                  onChange={handleChange}
                  name="img"
                  value={user.img}
                />
              </div>
              <div className="formInput">
                <label>Description</label>
                <textarea
                  type="text"
                  placeholder="опис"
                  onChange={handleChange}
                  name="descr"
                  value={user.descr}
                />
              </div>
              <div className="formInput">
                <label>Assignment</label>
                <select
                  name="role_id"
                  onChange={handleChange}
                  value={user.role_id}
                >
                  <option value="" disabled>
                    Виберіть посаду
                  </option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <button className="nav-addlink" onClick={handleClick}>
                Редагувати
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
