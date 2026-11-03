import {
    useEffect,
    useState
} from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";

import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";
import { useAuth } from "../auth/AuthContext";
import { useCourses } from "../context/CourseContext";
import {
    enrollStudent,
    getEnrollment
} from "../services/storage";

function Courses() {

    const navigate = useNavigate();
    const { loggedInStudent } = useAuth();

    const {
        courses,
        loading,
        error,
        fetchCourses
    } = useCourses();

    // Refresh from the backend every time the page is opened
    useEffect(() => {

        fetchCourses();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [search, setSearch] = useState("");

    const visibleCourses =
        courses.filter(
            (course) =>
                String(course.title || "")
                    .toLowerCase()
                    .includes(search.trim().toLowerCase())
        );


    function handleEnroll(course) {

        enrollStudent(loggedInStudent, course);

        localStorage.setItem(
            "selectedCourse",
            JSON.stringify(course)
        );

        navigate("/enrollment-success");
    }


    return (
        <>
            <PageCss href="/css/student.css" />

            <PageShell variant="student">

                <div className="container my-5">

                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

                        <h2 className="mb-0">
                            Browse Courses
                        </h2>

                        <input
                            type="search"
                            className="form-control"
                            style={{ maxWidth: "280px" }}
                            placeholder="Search Course"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />

                    </div>


                    {loading && courses.length === 0 && (

                        <p className="text-center mt-5">
                            Loading courses...
                        </p>

                    )}

                    {error && (

                        <p className="text-center text-warning">
                            {error}
                        </p>

                    )}

                    {!(loading && courses.length === 0) && visibleCourses.length === 0 ? (

                        <div className="text-center mt-5">

                            <h5>
                                No courses found.
                            </h5>

                            <p className="text-muted">
                                Try searching for another course.
                            </p>

                        </div>

                    ) : !(loading && courses.length === 0) && (

                        <div className="row g-4">

                            {visibleCourses.map((course) => {

                                const enrolled =
                                    getEnrollment(
                                        loggedInStudent?.email,
                                        course.id
                                    );

                                return (
                                    <div
                                        className="col-lg-4 col-md-6"
                                        key={course.id}
                                    >

                                        <div className="card h-100 course-card">

                                            <div
                                                className="text-center py-4"
                                                style={{ background: "var(--secondary)" }}
                                            >
                                                {course.image ? (

                                                    <img
                                                        src={course.image}
                                                        alt={course.title}
                                                        style={{ height: "70px" }}
                                                    />

                                                ) : (

                                                    <i
                                                        className="bi bi-mortarboard-fill display-3"
                                                        style={{ color: "var(--primary)" }}
                                                    ></i>

                                                )}
                                            </div>

                                            <div className="card-body">

                                                <h5>
                                                    {course.title}
                                                </h5>

                                                {course.instructor && (
                                                    <p>
                                                        <i className="bi bi-person-workspace"></i>
                                                        {" "}{course.instructor}
                                                    </p>
                                                )}

                                                {course.duration && (
                                                    <p>
                                                        <i className="bi bi-clock"></i>
                                                        {" "}{course.duration}
                                                    </p>
                                                )}

                                                <p>
                                                    {course.description}
                                                </p>

                                            </div>

                                            <div className="card-footer bg-white border-0">

                                                <Link
                                                    to={`/course-details/${course.id}`}
                                                    className="btn btn-outline-primary"
                                                >
                                                    Details
                                                </Link>

                                                {enrolled ? (

                                                    <Link
                                                        to={`/start-course/${course.id}`}
                                                        className="btn btn-primary float-end"
                                                    >
                                                        Continue
                                                    </Link>

                                                ) : (

                                                    <button
                                                        type="button"
                                                        className="btn btn-primary float-end"
                                                        onClick={() =>
                                                            handleEnroll(course)
                                                        }
                                                    >
                                                        Enroll
                                                    </button>

                                                )}

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

export default Courses;
