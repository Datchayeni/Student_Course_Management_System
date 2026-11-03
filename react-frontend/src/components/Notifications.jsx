import PageCss from "./PageCss";
import PageShell from "./PageShell";
import { useNotifications } from "../context/NotificationContext";

function Notifications() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

  return (
    <>
    <PageCss href="/css/student.css" />
    <PageShell variant="student">
    <section className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Live Notifications</h2>
        {unreadCount > 0 && (
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => markAllRead().catch(console.error)}
          >
            Mark all as read
          </button>
        )}
      </div>
      {notifications.length === 0 && <p>No notifications yet.</p>}
      {notifications.map((item) => (
        <div
          key={item._id}
          className={"alert " + (item.isRead ? "alert-light" : "alert-info") + " d-flex justify-content-between align-items-center"}
        >
          <div>
            {item.title && <h6 className="mb-1">{item.title}</h6>}
            <p className="mb-0">{item.message}</p>
            <small className="text-muted">
              {new Date(item.createdAt).toLocaleString()}
            </small>
          </div>
          {!item.isRead && (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => markRead(item._id).catch(console.error)}
            >
              Mark as Read
            </button>
          )}
        </div>
      ))}
    </section>
    </PageShell>
    </>
  );
}

export default Notifications;
