import { Link } from "react-router-dom";

import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";

function readSelectedCourse() {

    try {

        return JSON.parse(
            localStorage.getItem("selectedCourse") || "null"
        );

    } catch {

        return null;
    }
}

function EnrollmentSuccess() {

    const course = readSelectedCourse();

    return (
        <>
            <PageCss href="/css/student.css" />

            <PageShell variant="student">

                <div className="container py-5">

                    <div className="row justify-content-center">

                        <div className="col-lg-6">

                            <div className="card p-5 text-center">

                                <i className="bi bi-check-circle-fill display-1 text-success"></i>

                                <h2 className="mt-3">
                                    Enrollment Successful
                                </h2>

                                <p className="text-muted">
                                    {course?.title
                                        ? `You have successfully enrolled in ${course.title}.`
                                        : "You have successfully enrolled in the course."}
                                </p>

                                <div className="d-flex justify-content-center flex-wrap gap-2">

                                    {course?.id !== undefined && (
                                        <Link
                                            to={`/start-course/${course.id}`}
                                            className="btn btn-primary"
                                        >
                                            Start Learning
                                        </Link>
                                    )}

                                    <Link
                                        to="/my-courses"
                                        className="btn btn-outline-primary"
                                    >
                                        Go to My Courses
                                    </Link>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </PageShell>
        </>
    );
}

export default EnrollmentSuccess;
