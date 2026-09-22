import { Link } from "react-router-dom";

import PageCss from "../components/PageCss";
import PageShell from "../components/PageShell";

const FEATURES = [

    ["📚", "Course Management", "Browse and manage available courses."],
    ["👨‍🎓", "Enrollment", "Register and enroll in courses."],
    ["📈", "Progress Tracking", "Track completed and pending modules."],
    ["🔔", "Notifications", "Receive updates and reminders."]

];

function Home() {

    return (
        <>
            <PageCss href="/css/Stylesheet.css" />

            <PageShell variant="public">

                {/* Hero */}
                <section className="hero">

                    <div className="container">

                        <div className="hero-content text-center">

                            <h1 className="display-5 fw-bold">
                                Student Course Management and Learning Progress Tracker
                            </h1>

                            <p className="lead mt-3">
                                Manage your courses, enroll easily, and track your
                                learning progress efficiently.
                            </p>

                            <Link
                                to="/courses"
                                className="btn btn-primary btn-lg mt-3"
                            >
                                Explore Courses
                            </Link>

                        </div>

                    </div>

                </section>


                {/* Features */}
                <section className="container py-5">

                    <h2 className="text-center mb-5">
                        Our Features
                    </h2>

                    <div className="row g-4">

                        {FEATURES.map(([icon, title, text]) => (

                            <div
                                className="col-md-6 col-lg-3 d-flex"
                                key={title}
                            >

                                <div className="card feature-card text-center p-4 w-100">

                                    <div className="fs-1">
                                        {icon}
                                    </div>

                                    <h5 className="mt-3">
                                        {title}
                                    </h5>

                                    <p>
                                        {text}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                </section>

            </PageShell>
        </>
    );
}

export default Home;
