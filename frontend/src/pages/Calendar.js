import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { showError, showSuccess, showInfo } from "../utils/popup";

function Calendar() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: "", startTime: "", endTime: "" });
  const token = localStorage.getItem("token");

  // Fetch all events for the user
  const loadEvents = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      showError("Error Loading Events", "Please check your connection or login again.");
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Add new event
  const createEvent = async (e) => {
    e.preventDefault();

    if (!form.title || !form.startTime || !form.endTime) {
      return showError("Incomplete Form", "Please fill all fields.");
    }

    try {
      await axios.post("http://localhost:4000/api/events", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSuccess("Event Added!", "Your new event was created successfully.");
      setForm({ title: "", startTime: "", endTime: "" });
      loadEvents();
    } catch (err) {
      showError("Failed to Add Event", "Try again later.");
    }
  };

  // Mark event as swappable
  const makeSwappable = async (id) => {
    try {
      await axios.put(
        `http://localhost:4000/api/events/${id}`,
        { status: "SWAPPABLE" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showInfo("Swappable", "Your event is now swappable.");
      loadEvents();
    } catch (err) {
      showError("Error", "Unable to make this event swappable.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2 style={{ textAlign: "center", color: "#2d5b8e" }}>Your Calendar</h2>

        <form onSubmit={createEvent}>
          <input
            name="title"
            placeholder="Event Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <input
            type="datetime-local"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
          />
          <input
            type="datetime-local"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            required
          />
          <button type="submit">Add Event</button>
        </form>

        <div className="calendar-list">
          {events.length === 0 ? (
            <p style={{ textAlign: "center" }}>No events yet. Add one above.</p>
          ) : (
            events.map((ev) => (
              <div key={ev.id} className="calendar-item">
                <b>{ev.title}</b> <br />
                {new Date(ev.startTime).toLocaleString()} —{" "}
                {new Date(ev.endTime).toLocaleString()}
                <p>Status: {ev.status}</p>
                {ev.status === "BUSY" && (
                  <button onClick={() => makeSwappable(ev.id)}>
                    Make Swappable
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Calendar;
