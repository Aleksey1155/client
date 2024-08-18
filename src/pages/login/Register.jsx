import React from "react";
import { Link } from "react-router-dom";
import "./register.scss"

function Register() {
  return <div className="register">
  <div className="card">

  <div className="left">
        <h1>Register</h1>
        <form>
            <input type="text" placeholder="Username" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <input type="text" placeholder="Phone" />
            
            <button> Register</button>
        </form>
    </div>

    <div className="right">
        <h1>Hello !</h1>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolor nobis voluptates eius itaque ipsum velit facilis in neque, quae libero molestiae rerum minima animi corporis voluptatem assumenda ratione deserunt sapiente?</p>
        <span>Do you have an account?</span>
        <button><Link to={"/login"}>Login</Link></button>
    </div>
    
  </div>
  
  
  </div>;
}

export default Register;

