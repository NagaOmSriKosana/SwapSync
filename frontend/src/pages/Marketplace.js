import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Marketplace() {
  const [slots, setSlots] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  const token = localStorage.getItem("token");

  const fetchAll = async () => {
    try {
      const [swappableRes, myRes] = await Promise.all([
        axios.get("http://localhost:4000/api/swappable-slots", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:4000/api/events", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setSlots(swappableRes.data);
      setMySlots(myRes.data.filter((e) => e.status === "SWAPPABLE"));
    } catch (err) {
      console.error(err);
      alert("Failed to load marketplace.");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const requestSwap = async (theirSlotId, mySlotId) => {
    if (!mySlotId) {
      alert("Select one of your SWAPPABLE slots to offer.");
      return;
    }
    try {
      await axios.post(
        "http://localhost:4000/api/swap-request",
        { theirSlotId, mySlotId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Swap request sent!");
      // refresh both lists
      await fetchAll();
    } catch (err) {
      const msg =
        (err.response && (err.response.data.error || err.response.data.message)) ||
        err.message ||
        "Error sending request";
      alert("Could not send swap request: " + msg);
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Swappable Slots</h2>

        {slots.length === 0 ? (
          <p>No swappable slots available from other users.</p>
        ) : (
          slots.map((slot) => (
            <div key={slot.id} style={{ marginBottom: 12 }}>
              <b>{slot.title}</b> — by {slot.owner?.name || slot.ownerId}
              <br />
              {new Date(slot.startTime).toLocaleString()}
              <br />
              <select id={`offer-${slot.id}`} style={{ marginRight: 10, marginTop: 6 }}>
                <option value="">-- choose your slot --</option>
                {mySlots.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title} ({new Date(m.startTime).toLocaleString()})
                  </option>
                ))}
              </select>
              <button
                onClick={() =>
                  requestSwap(slot.id, document.getElementById(`offer-${slot.id}`).value)
                }
              >
                Request Swap
              </button>
              <hr />
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Marketplace;
