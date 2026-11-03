import {
    Link,
    useParams
} from "react-router-dom";

import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";
import { useAuth } from "../auth/AuthContext";
import {
    getCourse,
    getEnrollment,
    getProgress,
    getStudentEnrollments
} from "../services/storage";

/*
 * /certificate      -> list of the student's earned certificates
 * /certificate/:id  -> the certificate for one course
 */
function Certificate() {

    const { id } = useParams();
    const { loggedInStudent } = useAuth();

    const email = loggedInStudent?.email;


    // ---------------- LIST ----------------

    if (id === undefined) {

        const earned =
            getStudentEnrollments(email).filter(
                (enrollment) =>
                    getProgress(enrollment) === 100
            );

        return (
            <>
                <PageCss href="/css/student.css" />

                <PageShell variant="student">

                    <div className="container py-5">

                        <h2 className="mb-4">
                            My Certificates
                        </h2>

                        {earned.length === 0 ? (

                            <div className="text-center py-5">

                                <i className="bi bi-award fs-1"></i>

                                <h4 className="mt-3">
                                    No Certificates Yet
                                </h4>

                                <p className="text-muted">
                                    Complete every module of a course to earn a certificate.
                                </p>

                                <Link
                                    to="/my-courses"
                                    className="btn btn-primary"
                                >
                                    Go to My Courses
                                </Link>

                            </div>

                        ) : (

                            <div className="row g-4">

                                {earned.map((enrollment) => (

                                    <div
                                        className="col-lg-4 col-md-6"
                                        key={enrollment.id}
                                    >

                                        <div className="card p-4 h-100 text-center">

                                            <i className="bi bi-award-fill display-3 text-warning"></i>

                                            <h5 className="mt-3">
                                                {enrollment.title}
                                            </h5>

                                            {enrollment.completedOn && (
                                                <p className="text-muted">
                                                    Completed on {enrollment.completedOn}
                                                </p>
                                            )}

                                            <div className="mt-auto">
                                                <Link
                                                    to={`/certificate/${enrollment.id}`}
                                                    className="btn btn-primary"
                                                >
                                                    View Certificate
                                                </Link>
                                            </div>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                </PageShell>
            </>
        );
    }


    // ---------------- ONE CERTIFICATE ----------------

    const course = getCourse(id);

    const enrollment =
        course
            ? getEnrollment(email, course.id)
            : null;

    const finished =
        Boolean(enrollment) &&
        getProgress(enrollment, course) === 100;


    if (!finished) {

        return (
            <>
                <PageCss href="/css/student.css" />

                <PageShell variant="student">

                    <div className="container py-5 text-center">

                        <i className="bi bi-lock-fill display-1 text-secondary"></i>

                        <h2 className="mt-3">
                            Certificate Not Available
                        </h2>

                        <p className="text-muted">
                            {course && enrollment
                                ? "Complete all modules of this course to get your certificate."
                                : "You have not completed this course."}
                        </p>

                        <Link
                            to={
                                course && enrollment
                                    ? `/course-content/${course.id}`
                                    : "/my-courses"
                            }
                            className="btn btn-primary"
                        >
                            {course && enrollment
                                ? "Continue Course"
                                : "Go to My Courses"}
                        </Link>

                    </div>

                </PageShell>
            </>
        );
    }


    return (
        <>
            <PageCss href="/css/student.css" />

            <PageShell variant="student">

                <div className="container py-5">

                    <div className="certificate-card text-center">

                        <div className="mb-4">
                            <i className="bi bi-award-fill display-1 text-warning"></i>
                        </div>

                        <h5 className="text-uppercase text-secondary">
                            Certificate of Completion
                        </h5>

                        <h1 className="mt-3">
                            EduTrack
                        </h1>

                        <p className="mt-4">
                            This Certificate is Proudly Presented To
                        </p>

                        <h2 className="student-name">
                            {loggedInStudent?.name || "Student"}
                        </h2>

                        <p className="mt-4">
                            For successfully completing the course
                        </p>

                        <h3 className="course-name">
                            {course.title}
                        </h3>

                        <p className="mt-4">
                            Completion Date
                        </p>

                        <h5>
                            {enrollment.completedOn ||
                                new Date().toLocaleDateString()}
                        </h5>

                        <div className="row mt-5">

                            <div className="col-6">
                                <hr />
                                <h6>
                                    Instructor{course.instructor
                                        ? `: ${course.instructor}`
                                        : ""}
                                </h6>
                            </div>

                            <div className="col-6">
                                <hr />
                                <h6>
                                    Director
                                </h6>
                            </div>

                        </div>

                    </div>


                    <div className="text-center mt-5">

                        <button
                            type="button"
                            className="btn btn-primary me-3"
                            onClick={() => window.print()}
                        >
                            <i className="bi bi-printer"></i>
                            {" "}Print / Save as PDF
                        </button>

                        <Link
                            to="/certificate"
                            className="btn btn-outline-primary"
                        >
                            All Certificates
                        </Link>

                    </div>

                </div>

            </PageShell>
        </>
    );
}

export default Certificate;
