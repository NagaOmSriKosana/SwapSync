import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { showError, showSuccess, showInfo } from "../utils/popup";

function Requests() {
  const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch all requests
  const loadRequests = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/swap-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Show only pending ones
      const incoming = res.data.incoming.filter((r) => r.status === "PENDING");
      const outgoing = res.data.outgoing.filter((r) => r.status === "PENDING");
      setRequests({ incoming, outgoing });
    } catch (err) {
      showError("Error Loading Requests", "Try logging in again.");
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const respond = async (id, accept) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:4000/api/swap-response/${id}`,
        { accept },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (accept)
        showSuccess("Swap Accepted!", "Both users’ calendars have been updated.");
      else showInfo("Swap Rejected", "The request was declined.");

      await loadRequests();
    } catch (err) {
      const msg =
        (err.response &&
          (err.response.data.error || err.response.data.message)) ||
        err.message ||
        "Unknown error";
      showError("Could not respond to request", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2 style={{ textAlign: "center", color: "#2d5b8e" }}>
          Incoming Requests
        </h2>

        {requests.incoming.length === 0 ? (
          <p style={{ textAlign: "center" }}>No pending incoming requests.</p>
        ) : (
          requests.incoming.map((r) => (
            <div key={r.id} className="calendar-item">
              <p>
                <b>From:</b> {r.requesterId} <br />
                <small>Offer slot: {r.mySlotId}</small>
                <br />
                <small>Requested slot: {r.theirSlotId}</small>
              </p>

              <button disabled={loading} onClick={() => respond(r.id, true)}>
                Accept
              </button>
              <button disabled={loading} onClick={() => respond(r.id, false)}>
                Reject
              </button>
            </div>
          ))
        )}

        <h2
          style={{
            textAlign: "center",
            color: "#2d5b8e",
            marginTop: "40px",
          }}
        >
          Outgoing Requests
        </h2>

        {requests.outgoing.length === 0 ? (
          <p style={{ textAlign: "center" }}>No pending outgoing requests.</p>
        ) : (
          requests.outgoing.map((r) => (
            <div key={r.id} className="calendar-item">
              <p>
                <b>To:</b> {r.responderId} <br />
                <b>Status:</b> {r.status}
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Requests;
