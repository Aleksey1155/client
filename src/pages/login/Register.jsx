import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./register.scss";

function Register() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" })); // Очищення помилок при зміні полів
  };

  const handleClick = async (e) => {
    e.preventDefault();

    // Перевірка на пусті поля
    let validationErrors = {};
    if (!user.name) validationErrors.name = "Введіть ім'я користувача.";
    if (!user.email) validationErrors.email = "Введіть електронну пошту.";
    if (!user.password) validationErrors.password = "Введіть пароль.";
    if (!user.phone) validationErrors.phone = "Введіть номер телефону.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Перевірка унікальності `name` та `email`
      const res = await axios.post("http://localhost:3001/check-unique", {
        name: user.name,
        email: user.email,
      });
  
      if (res.data.nameExists || res.data.emailExists) {
        setErrors({
          name: res.data.nameExists ? "Це ім'я вже зайнято." : "",
          email: res.data.emailExists ? "Ця електронна пошта вже використовується." : "",
        });
        return;
      } else {
        // Якщо користувача з такими даними немає, реєструємо його
        await axios.post("http://localhost:3001/users", user);
        alert("Success!!!");
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              onChange={handleChange}
              name="name"
            />
            {errors.name && <span className="error">{errors.name}</span>}
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
            <input
              type="text"
              placeholder="Phone"
              onChange={handleChange}
              name="phone"
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
            <button onClick={handleClick}>Register</button>
          </form>
        </div>
        <div className="right">
          <h1>Hello!</h1>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolor
            nobis voluptates eius itaque ipsum velit facilis in neque, quae
            libero molestiae rerum minima animi corporis voluptatem assumenda
            ratione deserunt sapiente?
          </p>
          <span>Do you have an account?</span>
          <button>
            <Link to="/login">Login</Link>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
