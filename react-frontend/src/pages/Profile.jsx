import { Link } from "react-router-dom";

import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";
import { useAuth } from "../auth/AuthContext";

function Profile() {

    const { loggedInStudent } = useAuth();

    const student = loggedInStudent || {};

    const details = [

        ["Full Name", student.name],
        ["Student ID", student.studentId],
        ["Email Address", student.email],
        ["Department", student.department],
        ["Academic Year", student.year],
        ["Account Type", "Student"]

    ];

    return (
        <>
            <PageCss href="/css/student.css" />

            <PageShell variant="student">

                <section className="py-5">

                    <div className="container">

                        <div className="mb-4">

                            <h2 className="fw-bold">
                                My Profile
                            </h2>

                            <p className="text-muted">
                                View your personal and academic information.
                            </p>

                        </div>

                        <div className="row justify-content-center">

                            <div className="col-lg-8">

                                <div className="card border-0 shadow-sm">

                                    <div className="card-body text-center py-4">

                                        <i
                                            className="bi bi-person-circle display-1 mb-2"
                                            style={{ color: "var(--primary)" }}
                                        ></i>

                                        <h3 className="fw-bold">
                                            {student.name || "Student"}
                                        </h3>

                                        <p className="text-muted mb-0">
                                            Student
                                        </p>

                                    </div>

                                    <div className="card-body border-top">

                                        <h5 className="fw-bold mb-4">
                                            Personal Information
                                        </h5>

                                        <div className="row g-4">

                                            {details.map(([label, value]) => (

                                                <div
                                                    className="col-md-6"
                                                    key={label}
                                                >

                                                    <label className="text-muted">
                                                        {label}
                                                    </label>

                                                    <p className="fw-semibold mb-0">
                                                        {value || "-"}
                                                    </p>

                                                </div>

                                            ))}

                                        </div>

                                    </div>

                                    <div className="card-footer bg-white border-top p-4">

                                        <Link
                                            to="/dashboard"
                                            className="btn btn-primary"
                                        >
                                            <i className="bi bi-arrow-left"></i>
                                            {" "}Back to Dashboard
                                        </Link>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

            </PageShell>
        </>
    );
}

export default Profile;
