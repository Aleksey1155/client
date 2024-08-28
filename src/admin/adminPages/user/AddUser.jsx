import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./adduser.scss";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";

const AddUser = () => {
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

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get("http://localhost:3001/roles");
        setRoles(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/users", user);
      navigate("/admin/users");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="adduser">
      <div className="adduserContainer">
        <div className="top">
          <p className="title">New user</p>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              className="image"
              src="https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
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
                  placeholder="ПІБ нового виконавця"
                  onChange={handleChange}
                  name="name"
                />
              </div>

              <div className="formInput">
                <label>Email</label>
                <input
                  type="text"
                  placeholder="email нового виконавця"
                  onChange={handleChange}
                  name="email"
                />
              </div>
              <div className="formInput">
                <label>Password</label>
                <input
                  type="text"
                  placeholder="Пароль нового виконавця"
                  onChange={handleChange}
                  name="password"
                />
              </div>
              <div className="formInput">
                <label>Phone</label>
                <input
                  type="text"
                  placeholder="номер телефону"
                  onChange={handleChange}
                  name="phone"
                />
              </div>

              <div className="formInput">
                <label>Photo</label>
                <input
                  type="text"
                  placeholder="фото"
                  onChange={handleChange}
                  name="img"
                />
              </div>
              <div className="formInput">
                <label>Description</label>
                <textarea
                  type="text"
                  placeholder="опис"
                  onChange={handleChange}
                  name="descr"
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
                Додати
              </button>
            </form>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default AddUser;
