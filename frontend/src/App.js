import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Calendar from "./pages/Calendar";
import Marketplace from "./pages/Marketplace";
import Requests from "./pages/Requests";
import "./styles/main.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/requests" element={<Requests />} />
      </Routes>
    </Router>
  );
}

export default App;
