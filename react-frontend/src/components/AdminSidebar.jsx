import { NavLink } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";


const LINKS = [

    ["/admin-dashboard", "bi-speedometer2", "Dashboard"],
    ["/admin-courses", "bi-book", "Courses"],
    ["/admin-students", "bi-people", "Students"],
    ["/admin-notifications", "bi-bell", "Notifications"],
    ["/admin-reports", "bi-bar-chart-fill", "Reports"]

];


function AdminSidebar() {

    const { logoutAdmin } = useAuth();

    return (

        <div className="col-lg-2 sidebar">

            <h3 className="text-center py-4">
                <i className="bi bi-mortarboard-fill"></i>
                {" "}EduTrack
            </h3>

            {LINKS.map(([path, icon, label]) => (

                <NavLink
                    key={path}
                    to={path}
                >
                    <i className={`bi ${icon}`}></i>
                    {" "}{label}
                </NavLink>

            ))}

            <a
                href="/login"
                onClick={(event) => {
                    event.preventDefault();
                    logoutAdmin();
                }}
            >
                <i className="bi bi-box-arrow-right"></i>
                {" "}Logout
            </a>

        </div>

    );
}

export default AdminSidebar;
