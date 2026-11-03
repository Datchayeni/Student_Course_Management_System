import { Link } from "react-router-dom";

import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";
import { useAuth } from "../auth/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { getNotificationsForStudent } from "../services/storage";

function iconFor(item) {

    if (item.type === "chat") {

        return "bi-chat-dots-fill text-primary";
    }

    if (item.type === "admin") {

        return "bi-megaphone-fill text-danger";
    }

    if (item.title === "Course completed") {

        return "bi-award-fill text-warning";
    }

    if (item.title === "Module completed") {

        return "bi-check-circle-fill text-success";
    }

    return "bi-book-fill text-primary";
}

function Notifications() {

    const { loggedInStudent } = useAuth();

    const { notifications: live } = useNotifications();

    // Notifications from the server (admin announcements, chat alerts)
    // plus the local ones (enrollment, progress), newest first
    const notifications = [
        ...live.map((item) => ({
            id: item._id,
            title: item.title || "New message",
            message: item.message,
            date: item.createdAt,
            type: item.title ? "admin" : "chat"
        })),
        ...getNotificationsForStudent(loggedInStudent || {})
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <>
            <PageCss href="/css/student.css" />

            <PageShell variant="student">

                <div className="container py-5">

                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <h2 className="mb-0">
                            Notifications
                        </h2>

                        <Link
                            to="/student-dashboard"
                            className="btn btn-outline-primary"
                        >
                            Dashboard
                        </Link>

                    </div>

                    {notifications.length === 0 ? (

                        <div className="text-center py-5">

                            <i className="bi bi-bell fs-1"></i>

                            <h5 className="mt-3">
                                No Notifications
                            </h5>

                            <p className="text-muted">
                                You don't have any notifications yet.
                            </p>

                        </div>

                    ) : (

                        notifications.map((item) => (

                            <div
                                className="card notification-card mb-3"
                                key={item.id}
                            >

                                <div className="card-body d-flex">

                                    <div className="me-3">
                                        <i className={`bi ${iconFor(item)} display-6`}></i>
                                    </div>

                                    <div>

                                        <h5>
                                            {item.title}
                                        </h5>

                                        <p className="mb-1">
                                            {item.message}
                                        </p>

                                        <small className="text-muted">
                                            {new Date(item.date).toLocaleString()}
                                        </small>

                                    </div>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </PageShell>
        </>
    );
}

export default Notifications;
