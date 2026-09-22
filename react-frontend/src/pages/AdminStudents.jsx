import { useState } from "react";

import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";
import AdminSidebar from "../components/AdminSidebar";
import {
    getEnrollments,
    getProgress,
    getStudents,
    removeStudent
} from "../services/storage";

function badgeClass(percent) {

    if (percent === 100) {

        return "bg-success";
    }

    if (percent >= 50) {

        return "bg-primary";
    }

    return "bg-secondary";
}

function AdminStudents() {

    const [students, setStudents] = useState(() => getStudents());
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("");

    const enrollments = getEnrollments();

    const departments =
        [...new Set(
            students
                .map((student) => student.department)
                .filter(Boolean)
        )];

    const visibleStudents =
        students.filter((student) => {

            const text =
                `${student.name} ${student.email} ${student.studentId}`
                    .toLowerCase();

            return (
                text.includes(search.trim().toLowerCase()) &&
                (!department || student.department === department)
            );
        });


    function summary(student) {

        const own =
            enrollments.filter(
                (enrollment) =>
                    String(enrollment.studentEmail).toLowerCase() ===
                    String(student.email).toLowerCase()
            );

        if (own.length === 0) {

            return { count: 0, average: 0 };
        }

        const total =
            own.reduce(
                (sum, enrollment) =>
                    sum + getProgress(enrollment),
                0
            );

        return {
            count: own.length,
            average: Math.round(total / own.length)
        };
    }


    function handleDelete(student) {

        if (
            !window.confirm(
                `Delete ${student.name}? Their enrollments will be removed too.`
            )
        ) {
            return;
        }

        removeStudent(student.email);

        setStudents(getStudents());
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
                                    Manage Students
                                </h4>
                            </nav>

                            <div className="container py-4">

                                <div className="row mb-4">

                                    <div className="col-md-6">
                                        <input
                                            type="search"
                                            className="form-control"
                                            placeholder="Search Student"
                                            value={search}
                                            onChange={(event) =>
                                                setSearch(event.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <select
                                            className="form-select"
                                            value={department}
                                            onChange={(event) =>
                                                setDepartment(event.target.value)
                                            }
                                        >
                                            <option value="">
                                                All Departments
                                            </option>

                                            {departments.map((name) => (
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

                                <div className="card">

                                    <div className="card-body">

                                        {visibleStudents.length === 0 ? (

                                            <p className="mb-0">
                                                No students found.
                                            </p>

                                        ) : (

                                            <table className="table table-hover align-middle">

                                                <thead>
                                                    <tr>
                                                        <th>Student ID</th>
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Department</th>
                                                        <th>Courses</th>
                                                        <th>Progress</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>

                                                <tbody>

                                                    {visibleStudents.map((student) => {

                                                        const { count, average } =
                                                            summary(student);

                                                        return (
                                                            <tr key={student.email}>

                                                                <td>{student.studentId || "-"}</td>

                                                                <td>{student.name}</td>

                                                                <td>{student.email}</td>

                                                                <td>{student.department || "-"}</td>

                                                                <td>{count}</td>

                                                                <td>
                                                                    <span
                                                                        className={
                                                                            `badge ${badgeClass(average)}`
                                                                        }
                                                                    >
                                                                        {count === 0 ? "-" : `${average}%`}
                                                                    </span>
                                                                </td>

                                                                <td>

                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-danger"
                                                                        onClick={() =>
                                                                            handleDelete(student)
                                                                        }
                                                                    >
                                                                        <i className="bi bi-trash"></i>
                                                                    </button>

                                                                </td>

                                                            </tr>
                                                        );
                                                    })}

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

export default AdminStudents;
