import { useState } from "react";
import {
    Link,
    NavLink,
    useNavigate
} from "react-router-dom";

import { useAuth } from "../auth/AuthContext";


const STUDENT_LINKS = [

    ["/dashboard", "Dashboard"],
    ["/courses", "Browse Courses"],
    ["/my-courses", "My Courses"],
    ["/progress", "Progress"],
    ["/certificate", "Certificates"],
    ["/notifications", "Notifications"],
    ["/profile", "Profile"]

];


/*
 * variant:
 *   "public"  - visitors who are not logged in
 *   "student" - student pages
 *
 * (The admin pages use the sidebar in PageShell instead.)
 */
function Navbar({ variant = "student" }) {

    const navigate = useNavigate();

    const { logoutStudent } = useAuth();

    const [open, setOpen] = useState(false);

    const isPublic = variant === "public";


    function handleLogout() {

        logoutStudent();

        navigate("/login");
    }


    return (
        <header>

            <nav
                className={
                    "navbar navbar-expand-lg shadow-sm" +
                    (isPublic ? " bg-light sticky-top" : "")
                }
            >

                <div className="container">

                    <Link
                        className="navbar-brand fw-bold"
                        to={isPublic ? "/" : "/dashboard"}
                    >
                        <i className="bi bi-mortarboard-fill"></i>
                        {" "}EduTrack
                    </Link>


                    <button
                        className="navbar-toggler"
                        type="button"
                        aria-label="Toggle navigation"
                        aria-expanded={open}
                        onClick={() => setOpen(!open)}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>


                    <div
                        className={
                            "collapse navbar-collapse" +
                            (open ? " show" : "")
                        }
                    >

                        <ul
                            className={
                                "navbar-nav " +
                                (isPublic ? "mx-auto" : "ms-auto")
                            }
                            onClick={() => setOpen(false)}
                        >

                            {isPublic && (
                                <li className="nav-item">
                                    <NavLink
                                        className="nav-link"
                                        to="/"
                                    >
                                        Home
                                    </NavLink>
                                </li>
                            )}

                            {!isPublic && STUDENT_LINKS.map(
                                ([path, label]) => (
                                    <li
                                        className="nav-item"
                                        key={path}
                                    >
                                        <NavLink
                                            className="nav-link"
                                            to={path}
                                        >
                                            {label}
                                        </NavLink>
                                    </li>
                                )
                            )}

                        </ul>


                        {isPublic ? (

                            <div className="d-flex">

                                <Link
                                    className="btn btn-outline-primary me-2"
                                    to="/login"
                                >
                                    Login
                                </Link>

                                <Link
                                    className="btn btn-primary"
                                    to="/register"
                                >
                                    Register
                                </Link>

                            </div>

                        ) : (

                            <button
                                id="logoutBtn"
                                type="button"
                                className="btn btn-outline-danger ms-lg-3"
                                onClick={handleLogout}
                            >
                                <i className="bi bi-box-arrow-right"></i>
                                {" "}Logout
                            </button>

                        )}

                    </div>

                </div>

            </nav>

        </header>
    );
}


export default Navbar;
