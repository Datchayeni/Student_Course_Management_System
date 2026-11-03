import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";
import AdminSidebar from "../components/AdminSidebar";
import {
    getCertificateCount,
    getCourseReport,
    getCourses,
    getEnrollments,
    getStudents
} from "../services/storage";

function barClass(rate) {

    if (rate >= 75) {

        return "bg-success";
    }

    if (rate >= 50) {

        return "bg-primary";
    }

    return "bg-warning";
}

function AdminReports() {

    const report = getCourseReport();

    const stats = [

        ["bi-people-fill", getStudents().length, "Total Students"],
        ["bi-book-fill", getCourses().length, "Total Courses"],
        ["bi-journal-check", getEnrollments().length, "Total Enrollments"],
        ["bi-award-fill", getCertificateCount(), "Certificates Issued"]

    ];


    function downloadReport() {

        const rows = [
            ["Course", "Students", "Completed", "Completion Rate"],
            ...report.map((row) => [
                row.course.title,
                row.students,
                row.completed,
                `${row.rate}%`
            ])
        ];

        const csv =
            rows
                .map((row) =>
                    row
                        .map(
                            (value) =>
                                `"${String(value).replace(/"/g, '""')}"`
                        )
                        .join(",")
                )
                .join("\n");

        const url =
            URL.createObjectURL(
                new Blob([csv], { type: "text/csv" })
            );

        const link = document.createElement("a");

        link.href = url;
        link.download = "course-completion-report.csv";
        link.click();

        URL.revokeObjectURL(url);
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
                                    Reports &amp; Analytics
                                </h4>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={downloadReport}
                                >
                                    <i className="bi bi-download"></i>
                                    {" "}Download Report
                                </button>

                            </nav>

                            <div className="container py-4">

                                {/* Statistics */}
                                <div className="row g-4">

                                    {stats.map(([icon, value, label]) => (

                                        <div
                                            className="col-md-3"
                                            key={label}
                                        >

                                            <div className="dashboard-card">

                                                <i className={`bi ${icon} display-5`}></i>

                                                <h2>{value}</h2>

                                                <p>{label}</p>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                                {/* Course Completion */}
                                <div className="card mt-5">

                                    <div className="card-header">
                                        <h5>
                                            Course Completion Report
                                        </h5>
                                    </div>

                                    <div className="card-body">

                                        {report.length === 0 ? (

                                            <p className="mb-0">
                                                There are no courses yet.
                                            </p>

                                        ) : (

                                            <table className="table table-hover">

                                                <thead>
                                                    <tr>
                                                        <th>Course</th>
                                                        <th>Students</th>
                                                        <th>Completed</th>
                                                        <th style={{ minWidth: "200px" }}>
                                                            Completion Rate
                                                        </th>
                                                    </tr>
                                                </thead>

                                                <tbody>

                                                    {report.map((row) => (

                                                        <tr key={row.course.id}>

                                                            <td>{row.course.title}</td>

                                                            <td>{row.students}</td>

                                                            <td>{row.completed}</td>

                                                            <td>

                                                                <div className="progress">

                                                                    <div
                                                                        className={
                                                                            `progress-bar ${barClass(row.rate)}`
                                                                        }
                                                                        style={{ width: `${row.rate}%` }}
                                                                    >
                                                                        {row.rate}%
                                                                    </div>

                                                                </div>

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

export default AdminReports;
