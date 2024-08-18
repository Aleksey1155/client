import React from "react";
import { Link } from "react-router-dom";
import "./login.scss"

function Login() {
  return <div className="login">
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
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button> Login</button>
        </form>
    </div>
  </div>
  
  
  </div>;
}

export default Login;
