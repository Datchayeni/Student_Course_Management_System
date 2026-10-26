import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";

function ForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [role, setRole] = useState("student");
    const [error, setError] = useState("");

    function handleSubmit(event) {

        event.preventDefault();

        setError("");

        const key =
            role === "student"
                ? "students"
                : "admins";

        const users =
            JSON.parse(
                localStorage.getItem(key) || "[]"
            );

        const user =
            users.find(
                (item) => item.email === email
            );

        if (!user) {

            setError(
                "No account was found with this email."
            );

            return;
        }

        localStorage.setItem(
            "resetEmail",
            email
        );

        localStorage.setItem(
            "resetRole",
            role
        );

        navigate("/reset-password");
    }

    return (
        <>
            <PageCss href="/css/Stylesheet.css" />

            <PageShell variant="bare">

                <section className="login-page">

                    <div className="container">

                        <div className="row justify-content-center">

                            <div className="col-lg-5 col-md-7">

                                <div className="card shadow-lg login-card">

                                    <div className="card-body p-5">

                                        <h2 className="mt-3">
                                            Forgot Password
                                        </h2>

                                        <p className="text-muted">
                                            Enter your registered email address to reset your password.
                                        </p>

                                        {error && (
                                            <div className="alert alert-danger">
                                                {error}
                                            </div>
                                        )}

                                        <form onSubmit={handleSubmit}>

                                            <div className="mb-3">

                                                <label
                                                    className="form-label"
                                                    htmlFor="role"
                                                >
                                                    Account Type
                                                </label>

                                                <select
                                                    id="role"
                                                    className="form-select"
                                                    value={role}
                                                    onChange={(event) =>
                                                        setRole(event.target.value)
                                                    }
                                                >
                                                    <option value="student">
                                                        Student
                                                    </option>

                                                    <option value="admin">
                                                        Admin
                                                    </option>
                                                </select>

                                            </div>

                                            <div className="mb-4">

                                                <label
                                                    className="form-label"
                                                    htmlFor="email"
                                                >
                                                    Email Address
                                                </label>

                                                <div className="input-group">

                                                    <span className="input-group-text">
                                                        <i className="bi bi-envelope-fill"></i>
                                                    </span>

                                                    <input
                                                        id="email"
                                                        type="email"
                                                        className="form-control"
                                                        placeholder="Enter your Email"
                                                        value={email}
                                                        onChange={(event) =>
                                                            setEmail(event.target.value)
                                                        }
                                                        required
                                                    />

                                                </div>

                                            </div>

                                            <button
                                                type="submit"
                                                className="btn btn-primary w-100"
                                            >
                                                Continue
                                            </button>

                                            <p className="text-center mt-4 mb-0">
                                                Remember your password?{" "}
                                                <Link to="/login">
                                                    Back to Login
                                                </Link>
                                            </p>

                                        </form>

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

export default ForgotPassword;
