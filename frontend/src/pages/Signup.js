import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { showError, showSuccess } from "../utils/popup";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) =>
    password.length >= 6 && /[A-Z]/.test(password) && /\d/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password)
      return showError("Missing Fields", "All fields are required!");
    if (!validateEmail(form.email))
      return showError("Invalid Email", "Please enter a valid email address.");
    if (!validatePassword(form.password))
      return showError(
        "Weak Password",
        "Include at least 6 chars, 1 number & 1 uppercase letter."
      );

    try {
      await axios.post("http://localhost:4000/api/auth/signup", form);
      showSuccess("Signup Successful!", "Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000); // delay for popup animation
    } catch (err) {
      if (err.response?.status === 409)
        showError("Email Already Exists", "Try using another email address.");
      else
        showError("Signup Failed", "Something went wrong. Try again later.");
    }
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: "center", color: "#2d5b8e" }}>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email Address"
          type="email"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already registered? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Signup;
