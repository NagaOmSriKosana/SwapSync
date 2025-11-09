import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { showError, showSuccess } from "../utils/popup";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password)
      return alert("Please enter both email and password!");

    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      showSuccess("Login Successful!", "Redirecting to your calendar...");
      navigate("/calendar");
    } catch (err) {
      const msg = err.response?.data?.error || "Invalid email or password";
      showError("Login Failed", msg);
    }
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: "center", color: "#2d5b8e" }}>Welcome Back</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <p>
        New user? <Link to="/">Create an account</Link>
      </p>
    </div>
  );
}

export default Login;
