import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";
import AdminSidebar from "../components/AdminSidebar";
import { getCourses } from "../services/storage";

const CATEGORIES = [

    "Programming",
    "Web Development",
    "Artificial Intelligence",
    "Machine Learning",
    "Data Science",
    "Cloud Computing"

];

function AddCourse() {

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [instructor, setInstructor] = useState("");
    const [duration, setDuration] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");

    function handleSubmit(event) {

        event.preventDefault();

        const courses = getCourses();

        const newCourse = {
            id: Date.now(),
            title: title.trim(),
            instructor: instructor.trim(),
            duration: duration.trim(),
            category,
            description: description.trim()
        };

        courses.push(newCourse);

        localStorage.setItem(
            "courses",
            JSON.stringify(courses)
        );

        navigate("/admin-courses");
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
                                    Add New Course
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
                                                        placeholder="Enter Course Name"
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
                                                        placeholder="Instructor Name"
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
                                                        placeholder="12 Weeks"
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
                                                    placeholder="Enter Course Description"
                                                    value={description}
                                                    onChange={(event) =>
                                                        setDescription(event.target.value)
                                                    }
                                                    required
                                                ></textarea>

                                            </div>

                                            <div className="mb-4">

                                                <label className="form-label">
                                                    Upload Course Image
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
                                                <i className="bi bi-plus-circle"></i>
                                                {" "}Add Course
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => {
                                                    setTitle("");
                                                    setInstructor("");
                                                    setDuration("");
                                                    setCategory("");
                                                    setDescription("");
                                                }}
                                            >
                                                Reset
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

export default AddCourse;
