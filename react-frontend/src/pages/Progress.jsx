import { Link } from "react-router-dom";

import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";
import ProgressBar from "../components/ProgressBar";
import { useAuth } from "../auth/AuthContext";
import {
    getCourse,
    getModules,
    getProgress,
    getStudentEnrollments
} from "../services/storage";

function Progress() {

    const { loggedInStudent } = useAuth();

    const rows =
        getStudentEnrollments(loggedInStudent?.email)
            .map((enrollment) => {

                const course = getCourse(enrollment.id);

                const total =
                    getModules(course).length;

                const done =
                    new Set(
                        (enrollment.completedModules || []).filter(
                            (index) => index < total
                        )
                    ).size;

                return {
                    enrollment,
                    done,
                    total,
                    progress:
                        getProgress(enrollment, course)
                };
            });

    const completedCourses =
        rows.filter((row) => row.progress === 100).length;

    const modulesDone =
        rows.reduce((sum, row) => sum + row.done, 0);

    const stats = [

        ["bi-journal-bookmark-fill text-primary", rows.length, "Enrolled Courses"],
        ["bi-check-circle-fill text-success", completedCourses, "Completed"],
        ["bi-list-check text-warning", modulesDone, "Modules Completed"],
        ["bi-award-fill text-danger", completedCourses, "Certificates"]

    ];

    const achievements = [

        ["bi-flag-fill", "First Module Completed", modulesDone >= 1],
        ["bi-award-fill", "First Course Completed", completedCourses >= 1],
        ["bi-trophy-fill", "Three Courses Completed", completedCourses >= 3]

    ];

    return (
        <>
            <PageCss href="/css/student.css" />

            <PageShell variant="student">

                <div className="container py-5">

                    <h2 className="mb-4">
                        Learning Progress
                    </h2>


                    {/* Statistics */}
                    <div className="row g-4 mb-5">

                        {stats.map(([icon, value, label]) => (

                            <div
                                className="col-md-3"
                                key={label}
                            >

                                <div className="card text-center p-4">

                                    <i className={`bi ${icon} display-5`}></i>

                                    <h3 className="mt-3">
                                        {value}
                                    </h3>

                                    <p className="mb-0">
                                        {label}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>


                    {/* Course progress */}
                    <h3 className="mb-4">
                        Course Progress
                    </h3>

                    {rows.length === 0 ? (

                        <p>
                            You have not enrolled in any courses yet.{" "}
                            <Link to="/courses">
                                Browse courses
                            </Link>
                        </p>

                    ) : (

                        rows.map((row) => (

                            <div
                                className="card p-4 mb-4"
                                key={row.enrollment.id}
                            >

                                <div className="d-flex justify-content-between">

                                    <strong>
                                        {row.enrollment.title}
                                    </strong>

                                    <span>
                                        {row.done} / {row.total} modules
                                    </span>

                                </div>

                                <ProgressBar
                                    value={row.progress}
                                    className="mt-2"
                                />

                                <div className="mt-3 d-flex gap-2">

                                    <Link
                                        to={`/course-content/${row.enrollment.id}`}
                                        className="btn btn-sm btn-outline-primary"
                                    >
                                        View Modules
                                    </Link>

                                    {row.progress === 100 && (
                                        <Link
                                            to={`/certificate/${row.enrollment.id}`}
                                            className="btn btn-sm btn-success"
                                        >
                                            Certificate
                                        </Link>
                                    )}

                                </div>

                            </div>

                        ))

                    )}


                    {/* Achievements */}
                    <h3 className="mt-5 mb-4">
                        Achievements
                    </h3>

                    <div className="row g-4">

                        {achievements.map(([icon, title, earned]) => (

                            <div
                                className="col-md-4"
                                key={title}
                            >

                                <div
                                    className="card text-center p-4"
                                    style={{ opacity: earned ? 1 : 0.5 }}
                                >

                                    <i
                                        className={
                                            `bi ${icon} display-3 ` +
                                            (earned
                                                ? "text-warning"
                                                : "text-secondary")
                                        }
                                    ></i>

                                    <h5 className="mt-3">
                                        {title}
                                    </h5>

                                    <span
                                        className={
                                            "badge mx-auto " +
                                            (earned
                                                ? "bg-success"
                                                : "bg-secondary")
                                        }
                                    >
                                        {earned ? "Earned" : "Locked"}
                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </PageShell>
        </>
    );
}

export default Progress;
