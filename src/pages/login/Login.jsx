import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.scss";

function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post("http://localhost:3001/login", user);
  
      localStorage.setItem("token", res.data.token);
  
      const userRes = await axios.get("http://localhost:3001/me", {
        headers: {
          Authorization: `Bearer ${res.data.token}`,
        },
      });
  
      if (userRes.data.role_name === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };
  

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Hello !</h1>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolor nobis voluptates eius itaque ipsum velit facilis in neque, quae libero molestiae rerum minima animi corporis voluptatem assumenda ratione deserunt sapiente?</p>
          <span>Don't  you have an account?</span>
          <button><Link to={"/register"}>Register</Link></button>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input
              type="email"
              placeholder="Email"
              onChange={handleChange}
              name="email"
            />
            {errors.email && <span className="error">{errors.email}</span>}
            <input
              type="password"
              placeholder="Password"
              onChange={handleChange}
              name="password"
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
            <button className="login-button" onClick={handleClick}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
