import {
    Link,
    NavLink
} from "react-router-dom";

import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";
import ProgressBar from "../components/ProgressBar";
import { useAuth } from "../auth/AuthContext";
import {
    getNotificationsForStudent,
    getProgress,
    getStudentEnrollments
} from "../services/storage";

const MENU = [

    ["/dashboard", "bi-speedometer2", "Dashboard"],
    ["/courses", "bi-book", "Browse Courses"],
    ["/my-courses", "bi-journal-bookmark", "My Courses"],
    ["/progress", "bi-bar-chart", "Progress"],
    ["/certificate", "bi-award", "Certificates"],
    ["/notifications", "bi-bell", "Notifications"],
    ["/profile", "bi-person-circle", "Profile"]

];

function StudentDashboard() {

    const { loggedInStudent } = useAuth();

    const enrollments =
        getStudentEnrollments(loggedInStudent?.email)
            .map((enrollment) => ({
                enrollment,
                progress: getProgress(enrollment)
            }));

    const completed =
        enrollments.filter(
            (item) => item.progress === 100
        ).length;

    const average =
        enrollments.length === 0
            ? 0
            : Math.round(
                enrollments.reduce(
                    (sum, item) => sum + item.progress,
                    0
                ) / enrollments.length
            );

    const inProgress =
        enrollments
            .filter((item) => item.progress < 100)
            .slice(0, 2);

    const notifications =
        getNotificationsForStudent(loggedInStudent || {})
            .slice(0, 3);

    const stats = [

        ["Enrolled Courses", enrollments.length],
        ["Completed", completed],
        ["Progress", `${average}%`],
        ["Certificates", completed]

    ];

    return (
        <>
            <PageCss href="/css/student.css" />

            <PageShell variant="student">

                <div className="container-fluid">

                    <div className="row">

                        {/* Sidebar */}
                        <div className="col-lg-2 sidebar p-4">

                            <h5 className="mb-4">
                                Menu
                            </h5>

                            {MENU.map(([path, icon, label]) => (

                                <NavLink
                                    key={path}
                                    to={path}
                                >
                                    <i className={`bi ${icon}`}></i>
                                    {label}
                                </NavLink>

                            ))}

                        </div>


                        {/* Main content */}
                        <div className="col-lg-10 p-4">

                            <div className="welcome mb-4">

                                <h2>
                                    Welcome Back,{" "}
                                    {loggedInStudent?.name || "Student"} 👋
                                </h2>

                                <p className="mb-0">
                                    Continue your learning journey.
                                </p>

                            </div>


                            {/* Statistics */}
                            <div className="row g-4">

                                {stats.map(([label, value]) => (

                                    <div
                                        className="col-md-3"
                                        key={label}
                                    >

                                        <div className="card stat-card">

                                            <div className="card-body">

                                                <h6>{label}</h6>

                                                <h2>{value}</h2>

                                            </div>

                                        </div>

                                    </div>

                                ))}

                            </div>


                            {/* Continue learning */}
                            <h3 className="mt-5 mb-3">
                                Continue Learning
                            </h3>

                            {inProgress.length === 0 ? (

                                <div className="card p-4">

                                    <p className="mb-3">
                                        {enrollments.length === 0
                                            ? "You have not enrolled in any courses yet."
                                            : "You have completed all your courses."}
                                    </p>

                                    <div>
                                        <Link
                                            to="/courses"
                                            className="btn btn-primary"
                                        >
                                            Browse Courses
                                        </Link>
                                    </div>

                                </div>

                            ) : (

                                <div className="row g-4">

                                    {inProgress.map(({ enrollment, progress }) => (

                                        <div
                                            className="col-md-6"
                                            key={enrollment.id}
                                        >

                                            <div className="card p-4">

                                                <h5>
                                                    {enrollment.title}
                                                </h5>

                                                <ProgressBar
                                                    value={progress}
                                                    className="my-3"
                                                />

                                                <div>
                                                    <Link
                                                        to={`/start-course/${enrollment.id}`}
                                                        className="btn btn-primary"
                                                    >
                                                        Continue
                                                    </Link>
                                                </div>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}


                            {/* Notifications */}
                            <h3 className="mt-5 mb-3">
                                Recent Notifications
                            </h3>

                            <div className="card p-4">

                                {notifications.length === 0 ? (

                                    <p className="mb-0 text-muted">
                                        No notifications yet.
                                    </p>

                                ) : (

                                    <ul className="mb-0">

                                        {notifications.map((item) => (
                                            <li key={item.id}>
                                                {item.message}
                                            </li>
                                        ))}

                                    </ul>

                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </PageShell>
        </>
    );
}

export default StudentDashboard;
