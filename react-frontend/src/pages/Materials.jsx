import {
    Link,
    Navigate,
    useParams
} from "react-router-dom";

import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";
import CourseUnavailable from "../components/CourseUnavailable";
import { useAuth } from "../auth/AuthContext";
import {
    getCourse,
    getEnrollment,
    getModules,
    isModuleUnlocked
} from "../services/storage";

// Same six resource types the original materials.html listed.
const MATERIALS = [

    ["bi-file-earmark-pdf-fill text-danger", "Lecture Notes", "Complete reference notes."],
    ["bi-file-earmark-slides-fill text-warning", "Lecture Slides", "Lecture presentation slides."],
    ["bi-file-earmark-zip-fill text-primary", "Source Code", "Project source code files."],
    ["bi-journal-text text-success", "Assignment", "Practice assignment for this module."],
    ["bi-pencil-square text-info", "Practice Exercises", "Improve your skills."],
    ["bi-award-fill text-warning", "Course Guide", "Learning roadmap and course guide."]

];

function Materials() {

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


    return (
        <>
            <PageCss href="/css/student.css" />

            <PageShell variant="student">

                <div className="container py-5">

                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4">

                        <div>

                            <h2 className="mb-2">
                                Study Materials
                            </h2>

                            <p className="text-muted mb-0">
                                {course.title} • Module {index + 1} -{" "}
                                {modules[index]}
                            </p>

                        </div>

                        <Link
                            to={`/module/${course.id}/${index}`}
                            className="btn btn-outline-primary"
                        >
                            Back to Module
                        </Link>

                    </div>

                    <div className="row g-4">

                        {MATERIALS.map(([icon, title, text]) => (

                            <div
                                className="col-md-6 col-lg-4"
                                key={title}
                            >

                                <div className="card material-card p-4 text-center">

                                    <i className={`bi ${icon} display-3`}></i>

                                    <h5 className="mt-3">
                                        {title}
                                    </h5>

                                    <p>
                                        {text}
                                    </p>

                                    {/* No files are uploaded yet, so nothing to download. */}
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        disabled
                                    >
                                        Coming soon
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </PageShell>
        </>
    );
}

export default Materials;
