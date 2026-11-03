import { useEffect, useRef, useState } from "react";
import { createSocket } from "../api/socketClient";
import apiClient from "../api/apiClient";
import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";
import AdminSidebar from "../components/AdminSidebar";

function Chat({ admin = false }) {
  const [connected, setConnected] = useState(false);
  const [recipientId, setRecipientId] = useState("");
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  // The socket listener is created once, so it reads the currently
  // open conversation through a ref instead of a stale closure.
  const recipientRef = useRef("");
  const socketRef = useRef(null);

  useEffect(() => {
    const client = createSocket();

    client.on("connect", () => {
      setConnected(true);
      setError("");
    });

    client.on("disconnect", () => {
      setConnected(false);
    });

    client.on("connect_error", (err) => {
      setError(err.message);
    });

    client.on("receive_message", (data) => {
      // Ignore messages that belong to a different conversation
      const other = recipientRef.current;
      const belongsHere =
        other &&
        (String(data.sender) === other || String(data.recipient) === other);

      if (!belongsHere) {
        return;
      }

      setMessages((previous) =>
        previous.some((item) => item._id === data._id)
          ? previous
          : [...previous, data]
      );
    });

    socketRef.current = client;
    client.connect();

    // Fetch available students list
    apiClient
      .get("/profile/students")
      .then((response) => {
        setStudents(response.data.students);
      })
      .catch(() => {
        setError("Failed to load students list");
      });

    return () => {
      client.disconnect();
    };
  }, []);

  async function loadHistory(targetId) {
    const idToUse = targetId || recipientId;
    if (!idToUse) return;
    try {
      const response = await apiClient.get(`/messages/${idToUse}`);
      setMessages(response.data.messages);
    } catch {
      setError("Unable to load message history");
    }
  }

  function handleSelectStudent(id) {
    recipientRef.current = id;
    setRecipientId(id);
    setMessages([]);
    loadHistory(id);
  }

  function sendMessage(event) {
    event.preventDefault();
    const socket = socketRef.current;
    if (!socket || !connected) return;

    socket.emit(
      "send_message",
      { recipientId, text: message },
      (result) => {
        if (result?.success) {
          setMessage("");
        } else {
          setError(result?.message || "Message could not be sent");
        }
      }
    );
  }

  const content = (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h2>{admin ? "Chat with Students" : "Chat"}</h2>
      <p>
        Connection Status:{" "}
        <span style={{ color: connected ? "green" : "red", fontWeight: "bold" }}>
          {connected ? "Online" : "Offline"}
        </span>
      </p>
      {error && <p role="alert" style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", gap: "2rem", marginTop: "1rem" }}>
        {/* Left Column: Student Selection List */}
        <div
          style={{
            flex: 1,
            background: "#fff",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            maxHeight: "500px",
            overflowY: "auto",
          }}
        >
          <h3>{admin ? "Select Student" : "Select Contact"}</h3>
          {students.length === 0 && (
            <p style={{ color: "#666" }}>No other users found.</p>
          )}
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {students.map((student) => (
              <li
                key={student._id}
                onClick={() => handleSelectStudent(student._id)}
                style={{
                  padding: "10px",
                  marginBottom: "8px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  background: recipientId === student._id ? "#f3e5f5" : "#f9f9f9",
                  border: recipientId === student._id ? "1px solid #8B4513" : "1px solid #ddd",
                }}
              >
                <div style={{ fontWeight: "bold", color: "#333" }}>
                  {student.name}
                  {student.role === "admin" && (
                    <span className="badge bg-danger ms-2">Admin</span>
                  )}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>{student.email}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: Chat Box & History */}
        <div
          style={{
            flex: 2,
            background: "#fff",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <form
            onSubmit={sendMessage}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label style={{ fontSize: "0.85rem", color: "#555", display: "block", marginBottom: "4px" }}>
                Selected Recipient ID:
              </label>
              <input
                type="text"
                value={recipientId}
                readOnly
                placeholder="Click a name from the left list..."
                style={{
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  width: "100%",
                  background: "#eee",
                }}
                required
              />
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              maxLength={2000}
              rows={3}
              style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
              required
            />
            <button
              type="submit"
              disabled={!connected || !recipientId}
              style={{
                padding: "0.5rem",
                background: "#8B4513",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Send Message
            </button>
          </form>

          <hr style={{ margin: "1.5rem 0" }} />

          <h3>Conversation</h3>
          <div
            style={{
              maxHeight: "300px",
              overflowY: "auto",
              background: "#fafafa",
              padding: "1rem",
              borderRadius: "6px",
              border: "1px solid #eee",
            }}
          >
            {messages.length === 0 && (
              <p style={{ color: "#666" }}>No messages loaded yet. Select someone to begin.</p>
            )}
            {messages.map((item) => (
              <div
                key={item._id}
                style={{
                  marginBottom: "1rem",
                  borderBottom: "1px solid #eee",
                  paddingBottom: "0.5rem",
                }}
              >
                <strong style={{ color: "#8B4513" }}>
                  {item.sender === recipientId ? "Them" : "You"}:
                </strong>{" "}
                <span>{item.text}</span>
                <div style={{ fontSize: "0.75rem", color: "#888" }}>
                  {new Date(item.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (admin) {
    return (
      <>
        <PageCss href="/css/admin.css" />
        <PageShell variant="admin">
          <div className="container-fluid">
            <div className="row">
              <AdminSidebar />
              <div className="col-lg-10">{content}</div>
            </div>
          </div>
        </PageShell>
      </>
    );
  }

  return (
    <>
      <PageCss href="/css/student.css" />
      <PageShell variant="student">{content}</PageShell>
    </>
  );
}

export default Chat;