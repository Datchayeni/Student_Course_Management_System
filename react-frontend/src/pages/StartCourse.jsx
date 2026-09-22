import {
    Link,
    useParams
} from "react-router-dom";

import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";
import ProgressBar from "../components/ProgressBar";
import CourseUnavailable from "../components/CourseUnavailable";
import { useAuth } from "../auth/AuthContext";
import {
    getCourse,
    getEnrollment,
    getModules,
    getProgress
} from "../services/storage";

function StartCourse() {

    const { id } = useParams();
    const { loggedInStudent } = useAuth();

    const course = getCourse(id);

    const enrollment =
        course
            ? getEnrollment(loggedInStudent?.email, course.id)
            : null;


    if (!course || !enrollment) {

        return <CourseUnavailable course={course} />;
    }


    const modules = getModules(course);

    const completed =
        enrollment.completedModules || [];

    const progress =
        getProgress(enrollment, course);

    // First module the student has not finished yet.
    const nextIndex =
        modules.findIndex(
            (_, index) => !completed.includes(index)
        );


    return (
        <>
            <PageCss href="/css/student.css" />

            <PageShell variant="student">

                <div className="container py-5">

                    <div className="row justify-content-center">

                        <div className="col-lg-8">

                            <div className="card p-4">

                                <h2>
                                    {course.title}
                                </h2>

                                <p className="text-muted">
                                    {course.description}
                                </p>

                                <h6>
                                    Your Progress
                                </h6>

                                <ProgressBar value={progress} />

                                <p className="text-muted mt-2">
                                    {Math.min(completed.length, modules.length)} of{" "}
                                    {modules.length} modules completed
                                </p>

                                <div className="d-flex flex-wrap gap-2">

                                    {nextIndex === -1 ? (

                                        <Link
                                            to={`/certificate/${course.id}`}
                                            className="btn btn-success"
                                        >
                                            <i className="bi bi-award"></i>
                                            {" "}View Certificate
                                        </Link>

                                    ) : (

                                        <Link
                                            to={`/module/${course.id}/${nextIndex}`}
                                            className="btn btn-primary"
                                        >
                                            {completed.length === 0
                                                ? "Start Course"
                                                : "Continue Learning"}
                                        </Link>

                                    )}

                                    <Link
                                        to={`/course-content/${course.id}`}
                                        className="btn btn-outline-primary"
                                    >
                                        All Modules
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

export default StartCourse;
