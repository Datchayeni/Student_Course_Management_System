import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";
import { useAuth } from "../auth/AuthContext";

function Login() {

    const navigate = useNavigate();
    const location = useLocation();

    const {
        loginStudent,
        loginAdmin
    } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [error, setError] = useState("");

    function handleSubmit(event) {

        event.preventDefault();

        setError("");

        if (!email || !password) {

            setError("Please enter email and password.");
            return;

        }

        if (role === "student") {

            const students =
                JSON.parse(
                    localStorage.getItem("students") || "[]"
                );

            const student =
                students.find(
                    (item) =>
                        item.email === email &&
                        item.password === password
                );

            if (!student) {

                setError(
                    "Invalid student email or password."
                );

                return;
            }

            loginStudent(student);

            navigate(location.state?.from || "/dashboard");

        } else {

            const admins =
                JSON.parse(
                    localStorage.getItem("admins") || "[]"
                );

            const admin =
                admins.find(
                    (item) =>
                        item.email === email &&
                        item.password === password
                );

            if (!admin) {

                setError(
                    "Invalid admin email or password."
                );

                return;
            }

            loginAdmin(admin);

            navigate(location.state?.from || "/admin-dashboard");
        }
    }


    return (
        <>
            <PageCss href="/css/Stylesheet.css" />

            <PageShell variant="bare">

                <section className="login-page">

                    <div className="container">

                        <div className="row justify-content-center">

                            <div className="col-lg-5 col-md-7">

                                <div className="card shadow login-card">

                                    <div className="card-body p-5">

                                        <h2 className="text-center mb-4">
                                            <i className="bi bi-mortarboard-fill"></i>
                                            {" "}EduTrack
                                        </h2>

                                        <p className="text-center text-muted mb-4">
                                            Login to continue Learning
                                        </p>


                                        <ul className="nav nav-pills nav-justified mb-4">

                                            <li className="nav-item">
                                                <button
                                                    type="button"
                                                    className={
                                                        "nav-link" +
                                                        (role === "student" ? " active" : "")
                                                    }
                                                    onClick={() => {
                                                        setRole("student");
                                                        setError("");
                                                    }}
                                                >
                                                    Student
                                                </button>
                                            </li>

                                            <li className="nav-item">
                                                <button
                                                    type="button"
                                                    className={
                                                        "nav-link" +
                                                        (role === "admin" ? " active" : "")
                                                    }
                                                    onClick={() => {
                                                        setRole("admin");
                                                        setError("");
                                                    }}
                                                >
                                                    Admin
                                                </button>
                                            </li>

                                        </ul>


                                        {error && (
                                            <div className="alert alert-danger">
                                                {error}
                                            </div>
                                        )}


                                        <form onSubmit={handleSubmit}>

                                            <div className="mb-3">

                                                <label
                                                    className="form-label"
                                                    htmlFor="email"
                                                >
                                                    {role === "admin" ? "Admin Email" : "Email"}
                                                </label>

                                                <input
                                                    id="email"
                                                    type="email"
                                                    className="form-control"
                                                    value={email}
                                                    onChange={(event) =>
                                                        setEmail(event.target.value)
                                                    }
                                                    placeholder={
                                                        role === "admin"
                                                            ? "Enter admin email"
                                                            : "Enter your email"
                                                    }
                                                    required
                                                />

                                            </div>


                                            <div className="mb-3">

                                                <label
                                                    className="form-label"
                                                    htmlFor="password"
                                                >
                                                    Password
                                                </label>

                                                <input
                                                    id="password"
                                                    type="password"
                                                    className="form-control"
                                                    value={password}
                                                    onChange={(event) =>
                                                        setPassword(event.target.value)
                                                    }
                                                    placeholder="Enter your password"
                                                    required
                                                />

                                            </div>


                                            <div className="text-end mb-4">

                                                <Link to="/forgot-password">
                                                    Forgot Password?
                                                </Link>

                                            </div>


                                            <button
                                                type="submit"
                                                className="btn btn-primary w-100"
                                            >
                                                {role === "admin" ? "Admin Login" : "Student Login"}
                                            </button>

                                        </form>


                                        <p className="text-center mt-4 mb-0">

                                            {role === "admin" ? (
                                                <>
                                                    Need an admin account?{" "}
                                                    <Link to="/admin-register">
                                                        Register
                                                    </Link>
                                                </>
                                            ) : (
                                                <>
                                                    Don't have an account?{" "}
                                                    <Link to="/register">
                                                        Register
                                                    </Link>
                                                </>
                                            )}

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
