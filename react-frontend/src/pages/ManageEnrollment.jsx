import { useState } from "react";

import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";
import AdminSidebar from "../components/AdminSidebar";
import {
    getEnrollments,
    getProgress,
    removeEnrollment
} from "../services/storage";

function ManageEnrollment() {

    const [enrollments, setEnrollments] =
        useState(() => getEnrollments());


    function handleRemove(enrollment) {

        if (
            !window.confirm(
                `Remove ${enrollment.studentName || enrollment.studentEmail} from ${enrollment.title}?`
            )
        ) {
            return;
        }

        removeEnrollment(
            enrollment.studentEmail,
            enrollment.id
        );

        setEnrollments(getEnrollments());
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
                                    Manage Enrollment
                                </h4>
                            </nav>

                            <div className="container py-4">

                                <div className="card">

                                    <div className="card-body">

                                        {enrollments.length === 0 ? (

                                            <p className="mb-0">
                                                No enrollments found.
                                            </p>

                                        ) : (

                                            <table className="table table-hover align-middle">

                                                <thead>
                                                    <tr>
                                                        <th>Student</th>
                                                        <th>Course</th>
                                                        <th>Enrolled On</th>
                                                        <th>Progress</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>

                                                <tbody>

                                                    {enrollments.map((enrollment, index) => (

                                                        <tr
                                                            key={`${enrollment.studentEmail}-${enrollment.id}-${index}`}
                                                        >

                                                            <td>
                                                                {enrollment.studentName || "-"}
                                                                <br />
                                                                <small className="text-muted">
                                                                    {enrollment.studentEmail}
                                                                </small>
                                                            </td>

                                                            <td>{enrollment.title}</td>

                                                            <td>{enrollment.enrolledDate || "-"}</td>

                                                            <td>{getProgress(enrollment)}%</td>

                                                            <td>

                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-danger"
                                                                    onClick={() =>
                                                                        handleRemove(enrollment)
                                                                    }
                                                                >
                                                                    <i className="bi bi-trash"></i>
                                                                    {" "}Remove
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

export default ManageEnrollment;
