import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import { useNotifications } from "../context/NotificationContext";


function NotificationBell({ align = "end" }) {

    const {
        notifications,
        unreadCount,
        markRead,
        markAllRead
    } = useNotifications();

    const { loggedInAdmin } = useAuth();
    const isAdmin = Boolean(loggedInAdmin);

    const [open, setOpen] = useState(false);

    const latest = notifications.slice(0, 5);

    return (
        <div className="position-relative ms-lg-3 me-2">

            <button
                type="button"
                className="btn btn-outline-secondary position-relative"
                aria-label="Notifications"
                onClick={() => setOpen(!open)}
            >
                <i className="bi bi-bell-fill"></i>

                {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (

                <div
                    className={`card shadow position-absolute ${align === "start" ? "start-0" : "end-0"} mt-2 text-dark`}
                    style={{ width: "320px", zIndex: 1050 }}
                >

                    <div className="card-header d-flex justify-content-between align-items-center">
                        <strong>Notifications</strong>

                        {unreadCount > 0 && (
                            <button
                                type="button"
                                className="btn btn-link btn-sm p-0"
                                onClick={() => markAllRead().catch(console.error)}
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <ul className="list-group list-group-flush">

                        {latest.length === 0 && (
                            <li className="list-group-item text-muted">
                                No notifications yet.
                            </li>
                        )}

                        {latest.map((item) => (
                            <li
                                key={item._id}
                                className={
                                    "list-group-item" +
                                    (item.isRead ? "" : " fw-semibold")
                                }
                                style={{ cursor: item.isRead ? "default" : "pointer" }}
                                onClick={() =>
                                    !item.isRead && markRead(item._id).catch(console.error)
                                }
                            >
                                {item.title && <div>{item.title}</div>}
                                <div className={item.title ? "small fw-normal" : ""}>
                                    {item.message}
                                </div>
                            </li>
                        ))}

                    </ul>

                    <div className="card-footer text-center">
                        <Link
                            to={isAdmin ? "/admin-notifications" : "/live-notifications"}
                            onClick={() => setOpen(false)}
                        >
                            View all
                        </Link>
                    </div>

                </div>

            )}

        </div>
    );
}

export default NotificationBell;
