import {
    Link,
    Navigate,
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

// Placeholder lesson video (same one the original video-player.html used).
const VIDEO_URL =
    "https://www.youtube.com/embed/W6NZfCO5SIk";

function VideoPlayer() {

    const { id, moduleIndex } = useParams();
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


    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= modules.length ||
        !isModuleUnlocked(enrollment, index)
    ) {

        return (
            <Navigate
                to={`/course-content/${course.id}`}
                replace
            />
        );
    }


    const previousPath =
        index > 0
            ? `/video-player/${course.id}/${index - 1}`
            : null;

    const nextPath =
        index + 1 < modules.length &&
        isModuleUnlocked(enrollment, index + 1)
            ? `/video-player/${course.id}/${index + 1}`
            : null;


    return (
        <>
            <PageCss href="/css/student.css" />

            <PageShell variant="student">

                <div className="container py-5">

                    <div className="d-flex justify-content-end mb-3">

                        <Link
                            to={`/module/${course.id}/${index}`}
                            className="btn btn-outline-primary"
                        >
                            Back to Module
                        </Link>

                    </div>

                    <div className="row g-4">

                        {/* Video */}
                        <div className="col-lg-8">

                            <div className="card p-4">

                                <h2>
                                    {modules[index]}
                                </h2>

                                <p className="text-muted">
                                    {course.title} • Module {index + 1}
                                </p>

                                <div className="ratio ratio-16x9 mb-4">

                                    <iframe
                                        src={VIDEO_URL}
                                        title={`${modules[index]} video`}
                                        allowFullScreen
                                    ></iframe>

                                </div>

                                <div className="d-flex justify-content-between">

                                    {previousPath ? (
                                        <Link
                                            to={previousPath}
                                            className="btn btn-outline-primary"
                                        >
                                            <i className="bi bi-arrow-left"></i>
                                            {" "}Previous Lesson
                                        </Link>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary"
                                            disabled
                                        >
                                            <i className="bi bi-arrow-left"></i>
                                            {" "}Previous Lesson
                                        </button>
                                    )}

                                    {nextPath ? (
                                        <Link
                                            to={nextPath}
                                            className="btn btn-primary"
                                        >
                                            Next Lesson{" "}
                                            <i className="bi bi-arrow-right"></i>
                                        </Link>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            disabled
                                        >
                                            Next Lesson{" "}
                                            <i className="bi bi-arrow-right"></i>
                                        </button>
                                    )}

                                </div>

                            </div>

                        </div>


                        {/* Playlist */}
                        <div className="col-lg-4">

                            <div className="card p-4">

                                <h4>
                                    Course Playlist
                                </h4>

                                <hr />

                                <div className="list-group">

                                    {modules.map((name, position) => {

                                        const unlocked =
                                            isModuleUnlocked(enrollment, position);

                                        const label =
                                            `Lesson ${position + 1} - ${name}`;

                                        return unlocked ? (

                                            <Link
                                                key={position}
                                                to={`/video-player/${course.id}/${position}`}
                                                className={
                                                    "list-group-item" +
                                                    (position === index
                                                        ? " active"
                                                        : "")
                                                }
                                            >
                                                {label}
                                            </Link>

                                        ) : (

                                            <div
                                                key={position}
                                                className="list-group-item disabled"
                                                aria-disabled="true"
                                            >
                                                {label}
                                            </div>

                                        );
                                    })}

                                </div>

                                <hr />

                                <h5>
                                    Course Progress
                                </h5>

                                <ProgressBar
                                    value={getProgress(enrollment, course)}
                                    className="mt-3"
                                />

                                <Link
                                    to={`/materials/${course.id}/${index}`}
                                    className="btn btn-primary w-100 mt-4"
                                >
                                    Study Materials
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </PageShell>
        </>
    );
}

export default VideoPlayer;
