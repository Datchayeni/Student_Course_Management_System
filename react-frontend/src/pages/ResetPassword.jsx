import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";

function ResetPassword() {

    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    function handleSubmit(event) {

        event.preventDefault();

        setError("");

        const email =
            localStorage.getItem("resetEmail");

        const role =
            localStorage.getItem("resetRole");

        if (!email || !role) {

            setError(
                "Password reset session has expired."
            );

            return;
        }

        if (password !== confirmPassword) {

            setError(
                "Passwords do not match."
            );

            return;
        }

        const passwordPattern =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

        if (!passwordPattern.test(password)) {

            setError(
                "Password must contain at least 8 characters, including uppercase, lowercase, number and special character."
            );

            return;
        }

        const key =
            role === "student"
                ? "students"
                : "admins";

        const users =
            JSON.parse(
                localStorage.getItem(key) || "[]"
            );

        const updatedUsers =
            users.map((user) => {

                if (user.email === email) {

                    return {
                        ...user,
                        password
                    };
                }

                return user;
            });

        localStorage.setItem(
            key,
            JSON.stringify(updatedUsers)
        );

        localStorage.removeItem("resetEmail");
        localStorage.removeItem("resetRole");

        navigate("/login");
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

                                        <h2 className="text-center mb-3">
                                            <i className="bi bi-shield-lock-fill"></i>
                                            {" "}Reset Password
                                        </h2>

                                        <p className="text-center text-muted mb-4">
                                            Create a new password for your account.
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
                                                    htmlFor="newPassword"
                                                >
                                                    New Password
                                                </label>

                                                <div className="input-group">

                                                    <span className="input-group-text">
                                                        <i className="bi bi-lock-fill"></i>
                                                    </span>

                                                    <input
                                                        id="newPassword"
                                                        type="password"
                                                        className="form-control"
                                                        placeholder="Enter New Password"
                                                        value={password}
                                                        onChange={(event) =>
                                                            setPassword(event.target.value)
                                                        }
                                                        required
                                                    />

                                                </div>

                                                <small className="text-muted">
                                                    Password must contain at least 8 characters,
                                                    one uppercase letter, one lowercase letter,
                                                    one number and one special character.
                                                </small>

                                            </div>

                                            <div className="mb-4">

                                                <label
                                                    className="form-label"
                                                    htmlFor="confirmPassword"
                                                >
                                                    Confirm Password
                                                </label>

                                                <div className="input-group">

                                                    <span className="input-group-text">
                                                        <i className="bi bi-shield-lock-fill"></i>
                                                    </span>

                                                    <input
                                                        id="confirmPassword"
                                                        type="password"
                                                        className="form-control"
                                                        placeholder="Confirm Password"
                                                        value={confirmPassword}
                                                        onChange={(event) =>
                                                            setConfirmPassword(event.target.value)
                                                        }
                                                        required
                                                    />

                                                </div>

                                            </div>

                                            <button
                                                type="submit"
                                                className="btn btn-primary w-100"
                                            >
                                                Reset Password
                                            </button>

                                            <p className="text-center mt-4 mb-0">
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

export default ResetPassword;
