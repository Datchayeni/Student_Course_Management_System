import { Link } from "react-router-dom";

import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";
import AdminSidebar from "../components/AdminSidebar";
import { useAuth } from "../auth/AuthContext";
import {
    getCertificateCount,
    getCourses,
    getEnrollments,
    getStudents
} from "../services/storage";

function AdminDashboard() {

    const { loggedInAdmin } = useAuth();

    const stats = [

        ["bi-people-fill", getStudents().length, "Total Students"],
        ["bi-book-fill", getCourses().length, "Total Courses"],
        ["bi-journal-check", getEnrollments().length, "Enrollments"],
        ["bi-award-fill", getCertificateCount(), "Certifications"]

    ];

    const recent =
        [...getEnrollments()].reverse().slice(0, 5);

    return (
        <>
            <PageCss href="/css/admin.css" />

            <PageShell variant="admin">

                <div className="container-fluid">

                    <div className="row">

                        <AdminSidebar />

                        <div className="col-lg-10">

                            <nav className="navbar bg-white shadow-sm px-4">

                                <h4>
                                    Admin Dashboard
                                </h4>

                                <div>
                                    <span className="me-2">
                                        {loggedInAdmin?.name || "Admin"}
                                    </span>
                                    <i className="bi bi-person-circle fs-3"></i>
                                </div>

                            </nav>

                            <div className="container py-4">

                                {/* Cards */}
                                <div className="row g-4">

                                    {stats.map(([icon, value, label]) => (

                                        <div
                                            className="col-md-3"
                                            key={label}
                                        >

                                            <div className="dashboard-card">

                                                <i className={`bi ${icon} display-5`}></i>

                                                <h4>
                                                    {value}
                                                </h4>

                                                <p>
                                                    {label}
                                                </p>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                                {/* Recent Activity */}
                                <div className="card mt-5">

                                    <div className="card-header">
                                        <h4>
                                            Recent Activity
                                        </h4>
                                    </div>

                                    <div className="card-body">

                                        <table className="table table-hover">

                                            <thead>
                                                <tr>
                                                    <th>Student</th>
                                                    <th>Course</th>
                                                    <th>Enrolled On</th>
                                                </tr>
                                            </thead>

                                            <tbody>

                                                {recent.length === 0 ? (

                                                    <tr>
                                                        <td colSpan={3}>
                                                            No activity yet.
                                                        </td>
                                                    </tr>

                                                ) : (

                                                    recent.map((enrollment, index) => (

                                                        <tr key={index}>

                                                            <td>
                                                                {enrollment.studentName || "-"}
                                                            </td>

                                                            <td>
                                                                {enrollment.title}
                                                            </td>

                                                            <td>
                                                                {enrollment.enrolledDate || "-"}
                                                            </td>

                                                        </tr>

                                                    ))

                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                </div>

                                {/* Quick Actions */}
                                <div className="row mt-4">

                                    <div className="col-md-4">
                                        <Link
                                            to="/add-course"
                                            className="btn btn-primary w-100"
                                        >
                                            <i className="bi bi-plus-circle"></i>
                                            {" "}Add Course
                                        </Link>
                                    </div>

                                    <div className="col-md-4">
                                        <Link
                                            to="/admin-students"
                                            className="btn btn-success w-100"
                                        >
                                            <i className="bi bi-person-lines-fill"></i>
                                            {" "}Manage Students
                                        </Link>
                                    </div>

                                    <div className="col-md-4">
                                        <Link
                                            to="/admin-notifications"
                                            className="btn btn-warning text-white w-100"
                                        >
                                            <i className="bi bi-bell-fill"></i>
                                            {" "}Notifications
                                        </Link>
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

export default AdminDashboard;
