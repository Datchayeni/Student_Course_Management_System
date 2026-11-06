import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";
import api from "../services/api";
import { getErrorMessage } from "../utils/apiError";

function AdminRegister() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        adminId: "",
        email: "",
        department: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function handleChange(event) {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    }

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.name ||
            !formData.adminId ||
            !formData.email ||
            !formData.department ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            setError("Please fill in all fields.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const passwordPattern =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{12,}$/;

        if (!passwordPattern.test(formData.password)) {
            setError(
                "Password must contain at least 12 characters, including uppercase, lowercase, number and special character."
            );
            return;
        }

        // Create the admin in the database (POST /api/v1/auth/admin/register).
        // The password is hashed on the server and never kept in the browser.
        try {

            await api.post("/auth/admin/register", {
                name: formData.name.trim(),
                adminId: formData.adminId.trim(),
                email: formData.email.trim(),
                department: formData.department,
                password: formData.password
            });

        } catch (err) {

            setError(
                getErrorMessage(err, "Registration failed. Please check that the server is running and try again.")
            );

            return;
        }

        setSuccess(
            "Admin registration successful. Redirecting..."
        );

        setTimeout(() => {
            navigate("/login");
        }, 1000);
    }

    return (
        <>
            <PageCss href="/css/Stylesheet.css" />

            <PageShell variant="bare">

                <section className="login-page">

                    <div className="container">

                        <div className="row justify-content-center">

                            <div className="col-lg-8 col-md-10">

                                <div className="card shadow-lg login-card">

                                    <div className="card-body p-5">

                                        <h2 className="text-center mb-2">
                                            <i className="bi bi-person-plus-fill"></i>
                                            {" "}Register
                                        </h2>

                                        <p className="text-center text-muted mb-4">
                                            Create your EduTrack Account
                                        </p>

                                        <ul className="nav nav-pills nav-justified mb-4">

                                            <li className="nav-item">
                                                <Link
                                                    to="/register"
                                                    className="nav-link"
                                                >
                                                    Student
                                                </Link>
                                            </li>

                                            <li className="nav-item">
                                                <Link
                                                    to="/admin-register"
                                                    className="nav-link active"
                                                    style={{ color: "#fff" }}
                                                >
                                                    Admin
                                                </Link>
                                            </li>

                                        </ul>

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

                                            <div className="row">
                                                <div className="col-md-6"><div className="mb-3">

                                                <label
                                                    className="form-label"
                                                    htmlFor="name"
                                                >
                                                    Admin Name
                                                </label>

                                                <div className="input-group">

                                                    <span className="input-group-text">
                                                        <i className="bi bi-person-badge-fill"></i>
                                                    </span>

                                                    <input
                                                        id="name"
                                                        name="name"
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter Admin Name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        
                                                    />

                                                </div>

                                            </div></div>
                                                <div className="col-md-6"><div className="mb-3">

                                                <label
                                                    className="form-label"
                                                    htmlFor="adminId"
                                                >
                                                    Admin ID
                                                </label>

                                                <div className="input-group">

                                                    <span className="input-group-text">
                                                        <i className="bi bi-card-text"></i>
                                                    </span>

                                                    <input
                                                        id="adminId"
                                                        name="adminId"
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter Admin ID"
                                                        value={formData.adminId}
                                                        onChange={handleChange}
                                                        
                                                    />

                                                </div>

                                            </div></div>
                                            </div>

                                            <div className="mb-3">

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
                                                        name="email"
                                                        type="email"
                                                        className="form-control"
                                                        placeholder="Enter Email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        
                                                    />

                                                </div>

                                            </div>

                                            <div className="mb-3">

                                                <label
                                                    className="form-label"
                                                    htmlFor="department"
                                                >
                                                    Department
                                                </label>

                                                <select
                                                    id="department"
                                                    name="department"
                                                    className="form-select"
                                                    value={formData.department}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select Department</option>
                                                    <option value="Administration">Administration</option>
                                                    <option value="Computer Science">Computer Science</option>
                                                    <option value="Mathematics">Mathematics</option>
                                                    <option value="Commerce">Commerce</option>
                                                    <option value="Management">Management</option>
                                                </select>

                                            </div>

                                            <div className="row">
                                                <div className="col-md-6"><div className="mb-3">

                                                <label
                                                    className="form-label"
                                                    htmlFor="password"
                                                >
                                                    Password
                                                </label>

                                                <div className="input-group">

                                                    <span className="input-group-text">
                                                        <i className="bi bi-lock-fill"></i>
                                                    </span>

                                                    <input
                                                        id="password"
                                                        name="password"
                                                        type="password"
                                                        className="form-control"
                                                        placeholder="Password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        
                                                    />

                                                </div>

                                            </div></div>
                                                <div className="col-md-6"><div className="mb-3">

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
                                                        name="confirmPassword"
                                                        type="password"
                                                        className="form-control"
                                                        placeholder="Confirm Password"
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                        
                                                    />

                                                </div>

                                            </div></div>
                                            </div>

                                            <div className="form-check mb-4">

                                                <input
                                                    id="terms"
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    required
                                                />

                                                <label
                                                    className="form-check-label"
                                                    htmlFor="terms"
                                                >
                                                    I agree to the Terms &amp; Conditions
                                                </label>

                                            </div>

                                            <button
                                                type="submit"
                                                className="btn btn-primary w-100"
                                            >
                                                Create Admin Account
                                            </button>

                                            <p className="text-center mt-4 mb-0">
                                                Already have an account?{" "}
                                                <Link to="/login">
                                                    Login
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

export default AdminRegister;
