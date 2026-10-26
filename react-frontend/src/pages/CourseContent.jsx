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
    getProgress,
    isModuleUnlocked
} from "../services/storage";

function CourseContent() {

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


    return (
        <>
            <PageCss href="/css/student.css" />

            <PageShell variant="student">

                <div className="container py-5">

                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">

                        <div>

                            <h2 className="mb-2">
                                {course.title}
                            </h2>

                            <p className="text-muted">
                                {course.instructor &&
                                    `Instructor: ${course.instructor} | `}
                                {modules.length} modules
                            </p>

                        </div>

                        <Link
                            to="/my-courses"
                            className="btn btn-outline-primary"
                        >
                            Back
                        </Link>

                    </div>

                    <h6>
                        Course Progress
                    </h6>

                    <ProgressBar
                        value={progress}
                        className="mb-4"
                    />

                    <h4 className="mb-3">
                        Course Modules
                    </h4>

                    <div className="list-group">

                        {modules.map((name, index) => {

                            const done =
                                completed.includes(index);

                            const unlocked =
                                isModuleUnlocked(enrollment, index);

                            const status =
                                done
                                    ? "Completed"
                                    : unlocked
                                        ? "Continue"
                                        : "Locked";

                            const badgeClass =
                                done
                                    ? "bg-success"
                                    : unlocked
                                        ? "bg-warning text-dark"
                                        : "bg-secondary";

                            const content = (
                                <>
                                    <div>

                                        <h5>
                                            Module {index + 1} - {name}
                                        </h5>

                                        <small>
                                            {status}
                                        </small>

                                    </div>

                                    <span className={`badge ${badgeClass}`}>
                                        {done
                                            ? <i className="bi bi-check-circle-fill"></i>
                                            : status}
                                    </span>
                                </>
                            );

                            const classes =
                                "list-group-item list-group-item-action " +
                                "d-flex justify-content-between align-items-center";

                            return unlocked ? (

                                <Link
                                    key={index}
                                    className={classes}
                                    to={`/module/${course.id}/${index}`}
                                >
                                    {content}
                                </Link>

                            ) : (

                                <div
                                    key={index}
                                    className={`${classes} disabled`}
                                    aria-disabled="true"
                                >
                                    {content}
                                </div>

                            );
                        })}

                    </div>

                    {progress === 100 && (

                        <div className="mt-4">

                            <Link
                                to={`/certificate/${course.id}`}
                                className="btn btn-success"
                            >
                                <i className="bi bi-award"></i>
                                {" "}View Certificate
                            </Link>

                        </div>

                    )}

                </div>

            </PageShell>
        </>
    );
}

export default CourseContent;
