import { useState } from "react";
import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";
import AdminSidebar from "../components/AdminSidebar";
import {
    getCourse,
    getCourses
} from "../services/storage";

const CATEGORIES = [

    "Programming",
    "Web Development",
    "Artificial Intelligence",
    "Machine Learning",
    "Data Science",
    "Cloud Computing"

];

function EditCourseForm({ id }) {

    const navigate = useNavigate();

    const course = getCourse(id);

    const [title, setTitle] = useState(course?.title ?? "");
    const [instructor, setInstructor] = useState(course?.instructor ?? "");
    const [duration, setDuration] = useState(course?.duration ?? "");
    const [category, setCategory] = useState(course?.category ?? "");
    const [description, setDescription] = useState(course?.description ?? "");


    function handleSubmit(event) {

        event.preventDefault();

        const updated =
            getCourses().map((item) => {

                if (String(item.id) === String(id)) {

                    return {
                        ...item,
                        title: title.trim(),
                        instructor: instructor.trim(),
                        duration: duration.trim(),
                        category,
                        description: description.trim()
                    };
                }

                return item;
            });

        localStorage.setItem(
            "courses",
            JSON.stringify(updated)
        );

        navigate("/admin-courses");
    }


    function handleDelete() {

        if (
            !window.confirm(
                `Delete "${course.title}"? This cannot be undone.`
            )
        ) {
            return;
        }

        localStorage.setItem(
            "courses",
            JSON.stringify(
                getCourses().filter(
                    (item) => String(item.id) !== String(id)
                )
            )
        );

        navigate("/admin-courses");
    }


    if (!course) {

        return (
            <>
                <PageCss href="/css/admin.css" />

                <PageShell variant="admin">

                    <div className="container-fluid">

                        <div className="row">

                            <AdminSidebar />

                            <div className="col-lg-10">

                                <nav className="navbar bg-white shadow-sm px-4">
                                    <h4>Edit Course</h4>
                                </nav>

                                <div className="container py-4">

                                    <p>
                                        Course not found.
                                    </p>

                                    <Link
                                        to="/admin-courses"
                                        className="btn btn-primary"
                                    >
                                        Back to Courses
                                    </Link>

                                </div>

                            </div>

                        </div>

                    </div>

                </PageShell>
            </>
        );
    }


    return (
        <>
            <PageCss href="/css/admin.css" />

            <PageShell variant="admin">

                <div className="container-fluid">

                    <div className="row">

                        <AdminSidebar />

                        <div className="col-lg-10">

                            <nav className="navbar bg-white shadow-sm px-4">

                                <h4>
                                    Edit Course
                                </h4>

                                <Link
                                    to="/admin-courses"
                                    className="btn btn-outline-primary"
                                >
                                    Back
                                </Link>

                            </nav>

                            <div className="container py-4">

                                <div className="card">

                                    <div className="card-body">

                                        <form onSubmit={handleSubmit}>

                                            <div className="row">

                                                <div className="col-md-6 mb-3">

                                                    <label className="form-label">
                                                        Course Name
                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={title}
                                                        onChange={(event) =>
                                                            setTitle(event.target.value)
                                                        }
                                                        required
                                                    />

                                                </div>

                                                <div className="col-md-6 mb-3">

                                                    <label className="form-label">
                                                        Instructor
                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={instructor}
                                                        onChange={(event) =>
                                                            setInstructor(event.target.value)
                                                        }
                                                    />

                                                </div>

                                            </div>

                                            <div className="row">

                                                <div className="col-md-6 mb-3">

                                                    <label className="form-label">
                                                        Duration
                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={duration}
                                                        onChange={(event) =>
                                                            setDuration(event.target.value)
                                                        }
                                                    />

                                                </div>

                                                <div className="col-md-6 mb-3">

                                                    <label className="form-label">
                                                        Category
                                                    </label>

                                                    <select
                                                        className="form-select"
                                                        value={category}
                                                        onChange={(event) =>
                                                            setCategory(event.target.value)
                                                        }
                                                    >
                                                        <option value="">
                                                            Select Category
                                                        </option>

                                                        {CATEGORIES.map((name) => (
                                                            <option
                                                                key={name}
                                                                value={name}
                                                            >
                                                                {name}
                                                            </option>
                                                        ))}
                                                    </select>

                                                </div>

                                            </div>

                                            <div className="mb-3">

                                                <label className="form-label">
                                                    Course Description
                                                </label>

                                                <textarea
                                                    className="form-control"
                                                    rows={5}
                                                    value={description}
                                                    onChange={(event) =>
                                                        setDescription(event.target.value)
                                                    }
                                                    required
                                                ></textarea>

                                            </div>

                                            <div className="mb-4">

                                                <label className="form-label">
                                                    Change Course Image
                                                </label>

                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    disabled
                                                />

                                            </div>

                                            <button
                                                type="submit"
                                                className="btn btn-primary me-2"
                                            >
                                                <i className="bi bi-check-circle"></i>
                                                {" "}Update Course
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={handleDelete}
                                            >
                                                <i className="bi bi-trash"></i>
                                                {" "}Delete Course
                                            </button>

                                        </form>

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


function EditCourse() {

    const { id } = useParams();

    // key: reset the form if the URL switches to another course
    return (
        <EditCourseForm
            key={id}
            id={id}
        />
    );
}


export default EditCourse;
