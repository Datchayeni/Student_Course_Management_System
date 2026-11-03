import { Link } from "react-router-dom";

import PageCss from "./PageCss";
import PageShell from "./PageShell";


/*
 * Shown by the course pages (modules, video, materials...)
 * when the course does not exist, or the student has not
 * enrolled in it.
 */
function CourseUnavailable({ course }) {

    return (
        <>
            <PageCss href="/css/student.css" />

            <PageShell variant="student">

                <div className="container py-5 text-center">

                    <i className="bi bi-lock-fill display-1 text-secondary"></i>

                    <h2 className="mt-3">
                        {course
                            ? course.title
                            : "Course Not Found"}
                    </h2>

                    <p className="text-muted">
                        {course
                            ? "You are not enrolled in this course yet."
                            : "This course does not exist."}
                    </p>

                    {course ? (

                        <Link
                            to={`/course-details/${course.id}`}
                            className="btn btn-primary"
                        >
                            View Course Details
                        </Link>

                    ) : (

                        <Link
                            to="/courses"
                            className="btn btn-primary"
                        >
                            Browse Courses
                        </Link>

                    )}

                </div>

            </PageShell>
        </>
    );
}


export default CourseUnavailable;
