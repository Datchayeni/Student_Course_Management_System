import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";
import CourseUnavailable from "../components/CourseUnavailable";
import { useAuth } from "../auth/AuthContext";
import {
    enrollStudent,
    getCourse,
    getEnrollment,
    getModules
} from "../services/storage";

function CourseDetails() {

    const { id } = useParams();
    const navigate = useNavigate();
    const { loggedInStudent } = useAuth();

    const course = getCourse(id);

    const enrollment =
        course
            ? getEnrollment(loggedInStudent?.email, course.id)
            : null;


    function enrollCourse() {

        enrollStudent(loggedInStudent, course);

        // Kept from the original flow: the success page reads this.
        localStorage.setItem(
            "selectedCourse",
            JSON.stringify(course)
        );

        navigate("/enrollment-success");
    }


    if (!course) {

        return <CourseUnavailable course={null} />;
    }


    const modules = getModules(course);


    return (
        <>
            <PageCss href="/css/student.css" />

            <PageShell variant="student">

                {/* Banner */}
                <section className="course-banner">

                    <div className="container">

                        <div className="row align-items-center">

                            <div className="col-lg-7">

                                <h1>
                                    {course.title}
                                </h1>

                                <p className="lead">
                                    {course.description}
                                </p>

                                <div className="d-flex flex-wrap gap-4 mt-4">

                                    {course.instructor && (
                                        <span>
                                            <i className="bi bi-person-workspace"></i>
                                            {" "}{course.instructor}
                                        </span>
                                    )}

                                    {course.duration && (
                                        <span>
                                            <i className="bi bi-clock"></i>
                                            {" "}{course.duration}
                                        </span>
                                    )}

                                    <span>
                                        <i className="bi bi-list-check"></i>
                                        {" "}{modules.length} modules
                                    </span>

                                </div>

                                {enrollment ? (

                                    <Link
                                        to={`/start-course/${course.id}`}
                                        className="btn btn-primary btn-lg mt-4"
                                    >
                                        Continue Learning
                                    </Link>

                                ) : (

                                    <button
                                        type="button"
                                        className="btn btn-primary btn-lg mt-4"
                                        onClick={enrollCourse}
                                    >
                                        Enroll Now
                                    </button>

                                )}

                                <Link
                                    to="/courses"
                                    className="btn btn-outline-primary btn-lg mt-4 ms-2"
                                >
                                    Back to Courses
                                </Link>

                            </div>

                            <div className="col-lg-5 text-center d-none d-lg-block">

                                <i
                                    className="bi bi-mortarboard-fill"
                                    style={{
                                        fontSize: "9rem",
                                        color: "var(--primary)"
                                    }}
                                ></i>

                            </div>

                        </div>

                    </div>

                </section>


                {/* Modules + information */}
                <section className="py-5">

                    <div className="container">

                        <div className="row">

                            <div className="col-lg-8">

                                <h3>
                                    Course Modules
                                </h3>

                                <ul className="list-group mt-3">

                                    {modules.map((name, index) => (

                                        <li
                                            className="list-group-item"
                                            key={index}
                                        >
                                            Module {index + 1} - {name}
                                        </li>

                                    ))}

                                </ul>

                            </div>

                            <div className="col-lg-4 mt-4 mt-lg-0">

                                <div className="card p-4">

                                    <h4>
                                        Course Information
                                    </h4>

                                    <hr />

                                    <p>
                                        <strong>Instructor:</strong>
                                        <br />
                                        {course.instructor || "-"}
                                    </p>

                                    <p>
                                        <strong>Duration:</strong>
                                        <br />
                                        {course.duration || "-"}
                                    </p>

                                    <p className="mb-0">
                                        <strong>Certificate:</strong>
                                        <br />
                                        Yes
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

            </PageShell>
        </>
    );
}

export default CourseDetails;
