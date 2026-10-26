import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        studentId: "",
        email: "",
        department: "",
        year: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function handleChange(event) {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    }


    function handleSubmit(event) {

        event.preventDefault();

        setError("");
        setSuccess("");


        if (
            !formData.name ||
            !formData.studentId ||
            !formData.email ||
            !formData.department ||
            !formData.year ||
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
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;


        if (!passwordPattern.test(formData.password)) {

            setError(
                "Password must contain at least 8 characters, including uppercase, lowercase, number and special character."
            );

            return;
        }


        const students =
            JSON.parse(
                localStorage.getItem("students") || "[]"
            );


        const existingStudent =
            students.find(
                (student) =>
                    student.email === formData.email ||
                    student.studentId === formData.studentId
            );


        if (existingStudent) {

            setError(
                "A student with this email or student ID already exists."
            );

            return;
        }


        const newStudent = {

            name: formData.name,

            studentId: formData.studentId,

            email: formData.email,

            department: formData.department,

            year: formData.year,

            password: formData.password
        };


        students.push(newStudent);


        localStorage.setItem(
            "students",
            JSON.stringify(students)
        );


        setSuccess(
            "Registration successful. Redirecting to login..."
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
                                                    className="nav-link active"
                                                >
                                                    Student
                                                </Link>
                                            </li>

                                            <li className="nav-item">
                                                <Link
                                                    to="/admin-register"
                                                    className="nav-link"
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
                                                    Full Name
                                                </label>

                                                <div className="input-group">

                                                    <span className="input-group-text">
                                                        <i className="bi bi-person-fill"></i>
                                                    </span>

                                                    <input
                                                        id="name"
                                                        name="name"
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter Full Name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        
                                                    />

                                                </div>

                                            </div></div>
                                                <div className="col-md-6"><div className="mb-3">

                                                <label
                                                    className="form-label"
                                                    htmlFor="studentId"
                                                >
                                                    Student ID
                                                </label>

                                                <div className="input-group">

                                                    <span className="input-group-text">
                                                        <i className="bi bi-card-text"></i>
                                                    </span>

                                                    <input
                                                        id="studentId"
                                                        name="studentId"
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter Student ID"
                                                        value={formData.studentId}
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
                                                    Email
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

                                            <div className="row">
                                                <div className="col-md-6 mb-3">

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
                                                        <option value="B.Sc Computer Science">B.Sc Computer Science</option>
                                                        <option value="BCA">BCA</option>
                                                        <option value="B.Com">B.Com</option>
                                                        <option value="BBA">BBA</option>
                                                        <option value="B.Sc Mathematics">B.Sc Mathematics</option>
                                                </select>

                                            </div>
                                                <div className="col-md-6 mb-3">

                                                <label
                                                    className="form-label"
                                                    htmlFor="year"
                                                >
                                                    Year
                                                </label>

                                                <select
                                                    id="year"
                                                    name="year"
                                                    className="form-select"
                                                    value={formData.year}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select Year</option>
                                                        <option value="1st Year">1st Year</option>
                                                        <option value="2nd Year">2nd Year</option>
                                                        <option value="3rd Year">3rd Year</option>
                                                </select>

                                            </div>
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
                                                Create Student Account
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

export default Register;
