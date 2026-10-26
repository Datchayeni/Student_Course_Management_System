import {
    Link,
    Navigate,
    useNavigate,
    useParams
} from "react-router-dom";

import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";
import CourseUnavailable from "../components/CourseUnavailable";
import { useAuth } from "../auth/AuthContext";
import {
    completeModule,
    getCourse,
    getEnrollment,
    getModules,
    isModuleUnlocked
} from "../services/storage";

function Module() {

    const { id, moduleIndex } = useParams();
    const navigate = useNavigate();
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

    const index = Number(moduleIndex);

    const contentPath =
        `/course-content/${course.id}`;


    // Unknown module number, or a module that is still locked.
    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= modules.length ||
        !isModuleUnlocked(enrollment, index)
    ) {

        return (
            <Navigate
                to={contentPath}
                replace
            />
        );
    }


    const completed =
        (enrollment.completedModules || []).includes(index);

    const hasNext =
        index + 1 < modules.length;


    function handleComplete() {

        completeModule(
            loggedInStudent.email,
            course.id,
            index
        );

        navigate(contentPath);
    }


    return (
        <>
            <PageCss href="/css/student.css" />

            <PageShell variant="student">

                <div className="container py-5">

                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">

                        <p className="text-muted mb-0">
                            {course.title}
                        </p>

                        <Link
                            to={contentPath}
                            className="btn btn-outline-primary"
                        >
                            Back to Modules
                        </Link>

                    </div>

                    <div className="row g-4">

                        {/* Lesson */}
                        <div className="col-lg-8">

                            <div className="card p-4">

                                <h2>
                                    Module {index + 1} - {modules[index]}
                                </h2>

                                <p className="text-muted">
                                    Module {index + 1} of {modules.length}
                                </p>

                                <hr />

                                <p className="mb-0">
                                    Watch the lesson video and go through the
                                    study materials, then mark the module as
                                    completed to unlock the next one.
                                </p>

                            </div>

                        </div>


                        {/* Resources */}
                        <div className="col-lg-4">

                            <div className="card p-4">

                                <h4>
                                    Module Resources
                                </h4>

                                <hr />

                                <div className="d-grid gap-3">

                                    <Link
                                        to={`/video-player/${course.id}/${index}`}
                                        className="btn btn-primary"
                                    >
                                        <i className="bi bi-play-circle"></i>
                                        {" "}Watch Video
                                    </Link>

                                    <Link
                                        to={`/materials/${course.id}/${index}`}
                                        className="btn btn-outline-primary"
                                    >
                                        <i className="bi bi-file-earmark-pdf"></i>
                                        {" "}Study Materials
                                    </Link>

                                    {completed ? (

                                        <>
                                            <span className="badge bg-success py-2">
                                                <i className="bi bi-check-circle"></i>
                                                {" "}Module completed
                                            </span>

                                            {hasNext && (
                                                <Link
                                                    to={`/module/${course.id}/${index + 1}`}
                                                    className="btn btn-primary"
                                                >
                                                    Next Module
                                                </Link>
                                            )}
                                        </>

                                    ) : (

                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            onClick={handleComplete}
                                        >
                                            <i className="bi bi-check-circle"></i>
                                            {" "}Mark as Completed
                                        </button>

                                    )}

                                    <Link
                                        to="/progress"
                                        className="btn btn-warning text-white"
                                    >
                                        View Progress
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

export default Module;
