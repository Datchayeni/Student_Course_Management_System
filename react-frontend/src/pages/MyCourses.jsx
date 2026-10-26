import { Link } from "react-router-dom";

import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";
import ProgressBar from "../components/ProgressBar";
import { useAuth } from "../auth/AuthContext";
import {
    getCourse,
    getProgress,
    getStudentEnrollments
} from "../services/storage";

function MyCourses() {

    const { loggedInStudent } = useAuth();

    const enrollments =
        getStudentEnrollments(loggedInStudent?.email);

    return (
        <>
            <PageCss href="/css/student.css" />

            <PageShell variant="student">

                <div className="container py-5">

                    <div className="mb-4">

                        <h2>
                            My Courses
                        </h2>

                        <p className="text-muted mb-0">
                            Courses you have enrolled in.
                        </p>

                    </div>


                    {enrollments.length === 0 ? (

                        <div className="text-center py-5">

                            <i className="bi bi-book fs-1"></i>

                            <h4 className="mt-3">
                                No Courses Yet
                            </h4>

                            <p className="text-muted">
                                You haven't enrolled in any courses yet.
                            </p>

                            <Link
                                to="/courses"
                                className="btn btn-primary"
                            >
                                Browse Courses
                            </Link>

                        </div>

                    ) : (

                        <div className="row g-4">

                            {enrollments.map((enrollment) => {

                                const course =
                                    getCourse(enrollment.id);

                                const progress =
                                    getProgress(enrollment, course);

                                return (
                                    <div
                                        className="col-lg-6 col-md-6"
                                        key={enrollment.id}
                                    >

                                        <div className="card course-card h-100">

                                            <div className="card-body">

                                                <h4>
                                                    {enrollment.title}
                                                </h4>

                                                <p>
                                                    {enrollment.description}
                                                </p>

                                                <h6>
                                                    Progress
                                                </h6>

                                                <ProgressBar
                                                    value={progress}
                                                    className="mb-3"
                                                />

                                                {course?.instructor && (
                                                    <p className="mb-0">
                                                        <strong>Instructor:</strong>
                                                        {" "}{course.instructor}
                                                    </p>
                                                )}

                                            </div>

                                            <div className="card-footer bg-white border-0">

                                                <Link
                                                    className="btn btn-primary"
                                                    to={`/start-course/${enrollment.id}`}
                                                >
                                                    {progress === 100
                                                        ? "Review Course"
                                                        : "Continue Learning"}
                                                </Link>

                                            </div>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                    )}

                </div>

            </PageShell>
        </>
    );
}

export default MyCourses;
