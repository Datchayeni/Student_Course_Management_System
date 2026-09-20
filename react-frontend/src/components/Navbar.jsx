import { NavLink, useNavigate } from "react-router-dom";

function Navbar({ variant = "student" }) {

    const navigate = useNavigate();

    function handleLogout() {

        localStorage.removeItem("loggedInStudent");
        localStorage.removeItem("loggedInAdmin");

        navigate("/login");
    }

    return (
        <header>

            <nav>

                <NavLink to="/">
                    Home
                </NavLink>

                {variant === "student" && (
                    <>
                        <NavLink to="/dashboard">
                            Dashboard
                        </NavLink>

                        <NavLink to="/courses">
                            Browse Courses
                        </NavLink>

                        <NavLink to="/my-courses">
                            My Courses
                        </NavLink>

                        <NavLink to="/notifications">
                            Notifications
                        </NavLink>
                    </>
                )}

                {variant === "admin" && (
                    <>
                        <NavLink to="/admin-dashboard">
                            Dashboard
                        </NavLink>

                        <NavLink to="/courses">
                            Courses
                        </NavLink>

                        <NavLink to="/manage-enrollment">
                            Manage Enrollment
                        </NavLink>
                    </>
                )}

                {(variant === "student" ||
                    variant === "admin") && (

                    <button
                        type="button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                )}

            </nav>

        </header>
    );
}

export default Navbar;