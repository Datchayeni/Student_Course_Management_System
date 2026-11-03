import { useState } from "react";
import { Link } from "react-router-dom";

import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";
import AdminSidebar from "../components/AdminSidebar";
import {
    getCourses,
    getEnrollments,
    removeCourse
} from "../services/storage";

function AdminCourses() {

    const [courses, setCourses] = useState(() => getCourses());
    const [search, setSearch] = useState("");

    const enrollments = getEnrollments();

    const visibleCourses =
        courses.filter(
            (course) =>
                String(course.title || "")
                    .toLowerCase()
                    .includes(search.trim().toLowerCase())
        );


    function handleDelete(course) {

        const enrolled =
            enrollments.filter(
                (enrollment) =>
                    String(enrollment.id) === String(course.id)
            ).length;

        const warning =
            enrolled > 0
                ? `\n\n${enrolled} student(s) are enrolled and will lose this course.`
                : "";

        if (
            !window.confirm(
                `Delete "${course.title}"?${warning}`
            )
        ) {
            return;
        }

        removeCourse(course.id);

        setCourses(getCourses());
    }


    return (
        <>
            <PageCss href="/css/admin.css" />

            <PageShell variant="admin">

                <div className="container-fluid">

                    <div className="row">

                        <AdminSidebar />

                        <div className="col-lg-10">

                            <nav className="navbar shadow-sm bg-white px-4">

                                <h4>
                                    Course Management
                                </h4>

                                <Link
                                    to="/add-course"
                                    className="btn btn-primary"
                                >
                                    <i className="bi bi-plus-circle"></i>
                                    {" "}Add Course
                                </Link>

                            </nav>

                            <div className="container py-4">

                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <input
                                            type="search"
                                            className="form-control"
                                            placeholder="Search Course"
                                            value={search}
                                            onChange={(event) =>
                                                setSearch(event.target.value)
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="card">

                                    <div className="card-body">

                                        {visibleCourses.length === 0 ? (

                                            <p className="mb-0">
                                                No courses found.
                                            </p>

                                        ) : (

                                            <table className="table table-hover align-middle">

                                                <thead>
                                                    <tr>
                                                        <th>Course</th>
                                                        <th>Instructor</th>
                                                        <th>Duration</th>
                                                        <th>Enrolled</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>

                                                <tbody>

                                                    {visibleCourses.map((course) => (

                                                        <tr key={course.id}>

                                                            <td>{course.title}</td>

                                                            <td>{course.instructor || "-"}</td>

                                                            <td>{course.duration || "-"}</td>

                                                            <td>
                                                                {
                                                                    enrollments.filter(
                                                                        (enrollment) =>
                                                                            String(enrollment.id) ===
                                                                            String(course.id)
                                                                    ).length
                                                                }
                                                            </td>

                                                            <td>

                                                                <Link
                                                                    to={`/edit-course/${course.id}`}
                                                                    className="btn btn-sm btn-warning me-1"
                                                                >
                                                                    <i className="bi bi-pencil-square"></i>
                                                                </Link>

                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-danger"
                                                                    onClick={() =>
                                                                        handleDelete(course)
                                                                    }
                                                                >
                                                                    <i className="bi bi-trash"></i>
                                                                </button>

                                                            </td>

                                                        </tr>

                                                    ))}

                                                </tbody>

                                            </table>

                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </PageShell>
        </>
    );
}

export default AdminCourses;
