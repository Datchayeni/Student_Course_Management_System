import { useEffect, useState } from "react";

import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";
import AdminSidebar from "../components/AdminSidebar";
import api from "../services/api";

function AdminNotifications() {

    const [history, setHistory] = useState([]);
    const [students, setStudents] = useState([]);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [audience, setAudience] = useState("all");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [sending, setSending] = useState(false);

    const onlyStudents =
        students.filter((user) => user.role === "student");

    const departments =
        [...new Set(
            onlyStudents
                .map((student) => student.department)
                .filter(Boolean)
        )];


    async function loadHistory() {

        try {

            const response = await api.get("/notifications/sent");

            setHistory(response.data.sent);

        } catch {

            setError("Could not load the notification history.");
        }
    }


    useEffect(() => {

        api.get("/profile/students")
            .then((response) => setStudents(response.data.students))
            .catch(() => setError("Could not load the student list."));

        api.get("/notifications/sent")
            .then((response) => setHistory(response.data.sent))
            .catch(() => setError("Could not load the notification history."));

    }, []);


    async function handleSubmit(event) {

        event.preventDefault();

        setSuccess("");
        setError("");
        setSending(true);

        try {

            const response = await api.post("/notifications/send", {
                title: title.trim(),
                message: message.trim(),
                audience
            });

            setTitle("");
            setMessage("");
            setAudience("all");

            setSuccess(
                `Notification sent to ${response.data.delivered} student(s).`
            );

            loadHistory();

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Could not send the notification. Is the server running?"
            );

        } finally {

            setSending(false);
        }
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

                                        {error && (
                                            <div className="alert alert-danger">
                                                {error}
                                            </div>
                                        )}

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

                                                    {departments.length > 0 && (
                                                        <optgroup label="Department">
                                                            {departments.map((name) => (
                                                                <option
                                                                    key={name}
                                                                    value={name}
                                                                >
                                                                    {name}
                                                                </option>
                                                            ))}
                                                        </optgroup>
                                                    )}

                                                    {onlyStudents.length > 0 && (
                                                        <optgroup label="Single student">
                                                            {onlyStudents.map((student) => (
                                                                <option
                                                                    key={student._id}
                                                                    value={`student:${student._id}`}
                                                                >
                                                                    {student.name} ({student.email})
                                                                </option>
                                                            ))}
                                                        </optgroup>
                                                    )}
                                                </select>

                                            </div>

                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={sending}
                                            >
                                                <i className="bi bi-send-fill"></i>
                                                {" "}{sending ? "Sending..." : "Send Notification"}
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
                                                        <th>Read</th>
                                                    </tr>
                                                </thead>

                                                <tbody>

                                                    {history.map((item) => (

                                                        <tr key={item._id}>

                                                            <td>{item.title}</td>

                                                            <td>
                                                                {item.audience}
                                                            </td>

                                                            <td>
                                                                {new Date(item.createdAt).toLocaleString()}
                                                            </td>

                                                            <td>
                                                                <span className="badge bg-success">
                                                                    {item.read}/{item.delivered}
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
