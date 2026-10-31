import { useEffect, useState } from "react";
import { createSocket } from "../api/socketClient";
import apiClient from "../api/apiClient";

function Chat() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [recipientId, setRecipientId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

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
      setMessages((previous) => [...previous, data]);
    });

    client.connect();
    setSocket(client);

    return () => {
      client.disconnect();
    };
  }, []);

  async function loadHistory() {
    if (!recipientId) return;
    try {
      const response = await apiClient.get(`/messages/${recipientId}`);
      setMessages(response.data.messages);
    } catch (error) {
      setError("Unable to load message history");
    }
  }

  function sendMessage(event) {
    event.preventDefault();
    if (!socket || !connected) return;

    socket.emit(
      "send_message",
      { recipientId, text: message },
      (result) => {
        if (result.success) {
          setMessage("");
        } else {
          setError(result.message);
        }
      }
    );
  }

  return (
    <section>
      <h2>Student Chat</h2>
      <p>Connection: {connected ? "Online" : "Offline"}</p>
      {error && <p role="alert">{error}</p>}

      <form onSubmit={sendMessage}>
        <input
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
          placeholder="Recipient MongoDB user ID"
          required
        />
        <button type="button" onClick={loadHistory}>
          Load Chat History
        </button>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          maxLength={2000}
          required
        />
        <button type="submit" disabled={!connected}>
          Send
        </button>
      </form>

      <h3>Messages</h3>
      {messages.map((item) => (
        <p key={item._id}>
          <strong>{item.sender}:</strong> {item.text}
        </p>
      ))}
    </section>
  );
}

export default Chat;