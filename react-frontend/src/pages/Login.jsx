import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";
import api from "../services/api";
import { getErrorMessage } from "../utils/apiError";
import { useAuth } from "../auth/AuthContext";


function readLocalList(key) {

    try {

        const data = JSON.parse(localStorage.getItem(key) || "[]");

        return Array.isArray(data) ? data : [];

    } catch {

        return [];
    }
}


function Login() {

    const navigate = useNavigate();

    const {
        loginStudent,
        loginAdmin,
        logoutStudent,
        logoutAdmin
    } = useAuth();

    const [role, setRole] = useState("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    function switchRole(newRole) {

        setRole(newRole);
        setError("");
        setMessage("");
    }


    // Students sign in through the backend (POST /api/v1/auth/login -> JWT)
    async function studentLogin() {

        const response = await api.post("/auth/login", {
            email: email.trim(),
            password
        });

        const { token, student } = response.data;

        if (student.role === "admin") {

            throw new Error("This is an admin account. Use the Admin tab.");
        }

        // one session at a time
        logoutAdmin();

        // Per-tab token (sessionStorage): the Axios interceptor and the socket client read it
        sessionStorage.setItem("token", token);
        localStorage.removeItem("token");

        // Older accounts may only have studentId / year in localStorage
        const local =
            readLocalList("students").find(
                (item) =>
                    String(item.email || "").toLowerCase() ===
                    student.email.toLowerCase()
            ) || {};

        // The route guards and every student page read the logged-in
        // student from AuthContext, so it has to be set here.
        loginStudent({
            ...student,
            studentId: student.studentId || local.studentId || "",
            year: student.year || local.year || ""
        });

        setMessage(response.data.message || "Login successful");

        navigate("/student-dashboard", { replace: true });
    }


    // Admins also sign in through the backend (role "admin" in MongoDB)
    async function adminLogin() {

        const response = await api.post("/auth/login", {
            email: email.trim(),
            password
        });

        const { token, student: admin } = response.data;

        if (admin.role !== "admin") {

            throw new Error("This account is not an admin account.");
        }

        logoutStudent();

        sessionStorage.setItem("token", token);
        localStorage.removeItem("token");

        loginAdmin(admin);

        navigate("/admin-dashboard", { replace: true });
    }


    async function handleSubmit(event) {

        event.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {

            if (role === "admin") {

                await adminLogin();

            } else {

                await studentLogin();
            }

            setPassword("");

        } catch (err) {

            setError(
                getErrorMessage(err, "Login failed. Please check your email and password and try again.")
            );

        } finally {

            setLoading(false);
        }
    }


    return (
        <>
            <PageCss href="/css/Stylesheet.css" />

            <PageShell variant="bare">

                <section className="login-page">

                    <div className="container">

                        <div className="row justify-content-center">

                            <div className="col-lg-5 col-md-8">

                                <div className="card shadow-lg login-card">

                                    <div className="card-body p-5">

                                        <h2 className="text-center mb-2">
                                            <i className="bi bi-box-arrow-in-right"></i>
                                            {" "}Login
                                        </h2>

                                        <p className="text-center text-muted mb-4">
                                            Sign in to your EduTrack account
                                        </p>

                                        <ul className="nav nav-pills nav-justified mb-4">

                                            <li className="nav-item">
                                                <button
                                                    type="button"
                                                    className={
                                                        "nav-link w-100" +
                                                        (role === "student" ? " active" : "")
                                                    }
                                                    style={role === "student" ? { color: "#fff" } : undefined}
                                                    onClick={() => switchRole("student")}
                                                >
                                                    Student
                                                </button>
                                            </li>

                                            <li className="nav-item">
                                                <button
                                                    type="button"
                                                    className={
                                                        "nav-link w-100" +
                                                        (role === "admin" ? " active" : "")
                                                    }
                                                    style={role === "admin" ? { color: "#fff" } : undefined}
                                                    onClick={() => switchRole("admin")}
                                                >
                                                    Admin
                                                </button>
                                            </li>

                                        </ul>

                                        {error && (
                                            <div className="alert alert-danger" role="alert">
                                                {error}
                                            </div>
                                        )}

                                        {message && (
                                            <div className="alert alert-success" role="status">
                                                {message}
                                            </div>
                                        )}

                                        <form onSubmit={handleSubmit}>

                                            <div className="mb-3">

                                                <label className="form-label" htmlFor="email">
                                                    Email
                                                </label>

                                                <input
                                                    id="email"
                                                    type="email"
                                                    className="form-control"
                                                    placeholder="Enter your email"
                                                    value={email}
                                                    onChange={(event) => setEmail(event.target.value)}
                                                    required
                                                />

                                            </div>

                                            <div className="mb-3">

                                                <label className="form-label" htmlFor="password">
                                                    Password
                                                </label>

                                                <input
                                                    id="password"
                                                    type="password"
                                                    className="form-control"
                                                    placeholder="Enter your password"
                                                    value={password}
                                                    onChange={(event) => setPassword(event.target.value)}
                                                    required
                                                />

                                            </div>

                                            <div className="text-end mb-3">
                                                <Link to="/forgot-password">
                                                    Forgot password?
                                                </Link>
                                            </div>

                                            <button
                                                type="submit"
                                                className="btn btn-primary w-100"
                                                disabled={loading}
                                            >
                                                {loading ? "Logging in..." : "Login"}
                                            </button>

                                        </form>

                                        <p className="text-center mt-4 mb-0">
                                            Don't have an account?{" "}
                                            <Link to={role === "admin" ? "/admin-register" : "/register"}>
                                                Register here
                                            </Link>
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

            </PageShell>
        </>
    );
}

export default Login;
