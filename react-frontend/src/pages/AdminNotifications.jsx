import { useState } from "react";

import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";
import AdminSidebar from "../components/AdminSidebar";
import {
    getAdminNotifications,
    getStudents,
    sendAdminNotification
} from "../services/storage";

function AdminNotifications() {

    const [history, setHistory] = useState(() => getAdminNotifications());
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [audience, setAudience] = useState("all");
    const [success, setSuccess] = useState("");

    const departments =
        [...new Set(
            getStudents()
                .map((student) => student.department)
                .filter(Boolean)
        )];


    function handleSubmit(event) {

        event.preventDefault();

        sendAdminNotification({
            title: title.trim(),
            message: message.trim(),
            audience
        });

        setHistory(getAdminNotifications());

        setTitle("");
        setMessage("");
        setAudience("all");

        setSuccess("Notification sent.");
    }


    return (
        <>
            <PageCss href="/css/admin.css" />

            <PageShell variant="admin">

                <div className="container-fluid">

                    <div className="row">

                        <AdminSidebar />

                        <div className="col-lg-10">

                            <nav className="navbar shadow-sm bg-white px-4">
                                <h4>
                                    Notifications
                                </h4>
                            </nav>

                            <div className="container py-4">

                                {/* Send Notification */}
                                <div className="card mb-4">

                                    <div className="card-header">
                                        <h5>
                                            Send Notification
                                        </h5>
                                    </div>

                                    <div className="card-body">

                                        {success && (
                                            <div className="alert alert-success">
                                                {success}
                                            </div>
                                        )}

                                        <form onSubmit={handleSubmit}>

                                            <div className="mb-3">

                                                <label className="form-label">
                                                    Notification Title
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter title"
                                                    value={title}
                                                    onChange={(event) =>
                                                        setTitle(event.target.value)
                                                    }
                                                    required
                                                />

                                            </div>

                                            <div className="mb-3">

                                                <label className="form-label">
                                                    Message
                                                </label>

                                                <textarea
                                                    className="form-control"
                                                    rows={5}
                                                    placeholder="Enter notification message"
                                                    value={message}
                                                    onChange={(event) =>
                                                        setMessage(event.target.value)
                                                    }
                                                    required
                                                ></textarea>

                                            </div>

                                            <div className="mb-3">

                                                <label className="form-label">
                                                    Send To
                                                </label>

                                                <select
                                                    className="form-select"
                                                    value={audience}
                                                    onChange={(event) =>
                                                        setAudience(event.target.value)
                                                    }
                                                >
                                                    <option value="all">
                                                        All Students
                                                    </option>

                                                    {departments.map((name) => (
                                                        <option
                                                            key={name}
                                                            value={name}
                                                        >
                                                            {name}
                                                        </option>
                                                    ))}
                                                </select>

                                            </div>

                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                            >
                                                <i className="bi bi-send-fill"></i>
                                                {" "}Send Notification
                                            </button>

                                        </form>

                                    </div>

                                </div>

                                {/* Notification History */}
                                <div className="card">

                                    <div className="card-header">
                                        <h5>
                                            Notification History
                                        </h5>
                                    </div>

                                    <div className="card-body">

                                        {history.length === 0 ? (

                                            <p className="mb-0">
                                                No notifications have been sent yet.
                                            </p>

                                        ) : (

                                            <table className="table table-hover">

                                                <thead>
                                                    <tr>
                                                        <th>Title</th>
                                                        <th>Recipient</th>
                                                        <th>Date</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>

                                                <tbody>

                                                    {history.map((item) => (

                                                        <tr key={item.id}>

                                                            <td>{item.title}</td>

                                                            <td>
                                                                {item.audience === "all"
                                                                    ? "All Students"
                                                                    : item.audience}
                                                            </td>

                                                            <td>
                                                                {new Date(item.date).toLocaleDateString()}
                                                            </td>

                                                            <td>
                                                                <span className="badge bg-success">
                                                                    Sent
                                                                </span>
                                                            </td>

                                                        </tr>

                                                    ))}

                                                </tbody>

                                            </table>

                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </PageShell>
        </>
    );
}

export default AdminNotifications;
