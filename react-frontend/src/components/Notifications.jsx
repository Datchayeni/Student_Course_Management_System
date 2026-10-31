import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import { createSocket } from "../api/socketClient";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let active = true;

    apiClient.get("/notifications").then((response) => {
      if (active) {
        setNotifications(response.data.notifications);
      }
    }).catch(console.error);

    const socket = createSocket();

    socket.on("new_notification", (notification) => {
      setNotifications((previous) => [notification, ...previous]);
    });

    socket.connect();

    return () => {
      active = false;
      socket.disconnect();
    };
  }, []);

  async function markRead(id) {
    await apiClient.patch(`/notifications/${id}/read`);
    setNotifications((previous) =>
      previous.map((item) =>
        item._id === id ? { ...item, isRead: true } : item
      )
    );
  }

  return (
    <section>
      <h2>Notifications</h2>
      {notifications.length === 0 && <p>No notifications yet.</p>}
      {notifications.map((item) => (
        <div key={item._id}>
          <p>{item.message}</p>
          {!item.isRead && (
            <button onClick={() => markRead(item._id)}>Mark as Read</button>
          )}
        </div>
      ))}
    </section>
  );
}

export default Notifications;