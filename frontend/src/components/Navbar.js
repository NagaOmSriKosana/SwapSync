import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    // optionally remove other app state
    navigate("/"); // go to signup (home)
  };

  return (
    <div className="navbar">
      <div><strong>SlotSwapper</strong></div>
      <div>
        <Link to="/calendar">Calendar</Link>
        <Link to="/marketplace">Marketplace</Link>
        <Link to="/requests">Requests</Link>
        <button onClick={handleLogout} style={{ background: "transparent", border: "none", color: "white", cursor: "pointer", marginLeft: 10 }}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
