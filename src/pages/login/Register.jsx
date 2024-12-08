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

  const generatePassword = (length, alphabet) => {
    let password = ''; // Ініціалізація порожнього рядка
    const charactersLength = alphabet.length;// Довжина алфавіту
    // Цикл для генерації пароля 
    for (let i = 0; i < length; i++) {
      password += alphabet.charAt(Math.floor(Math.random() * charactersLength));
    }
    return password;
  };

  const handleGeneratePassword = () => {
    // Символи для генерації пароля
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    const length = 12; // довжина пароля
    const password = generatePassword(length, alphabet);
    setUser((prev) => ({ ...prev, password })); // Оновлення пароля в стані
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

              {/* Інпут і кнопка для генерування паролів */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Password"
                value={user.password} 
                onChange={handleChange}
                name="password"
                style={{ flexGrow: 1 }} 
              />
              <button
              className="btn_generate"
                type="button" // "button", щоб уникнути поведінки за замовчуванням
                onClick={handleGeneratePassword} // Викликаємо функцію для генерації 
                style={{ marginLeft: "10px" }} 
              >
                Генерувати
              </button>
            </div>



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
