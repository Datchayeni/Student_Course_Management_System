import {
    Navigate,
    Outlet,
    useLocation
} from "react-router-dom";

import { useAuth } from "../auth/AuthContext";


/*
 * Layout route that only renders its child routes when the
 * right kind of user is logged in.
 *
 *   <Route element={<ProtectedRoute role="student" />}>
 *       ...student routes...
 *   </Route>
 *
 * - Not logged in            -> /login
 * - Logged in as the other role -> that user's own dashboard
 */
function ProtectedRoute({
    role = "student"
}) {

    const {
        loggedInStudent,
        loggedInAdmin
    } = useAuth();

    const location = useLocation();


    const allowed =
        role === "admin"
            ? loggedInAdmin
            : loggedInStudent;


    if (allowed) {

        return <Outlet />;
    }


    if (role === "admin" && loggedInStudent) {

        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }


    if (role === "student" && loggedInAdmin) {

        return (
            <Navigate
                to="/admin-dashboard"
                replace
            />
        );
    }


    return (
        <Navigate
            to="/login"
            replace
            state={{
                from: location.pathname
            }}
        />
    );
}


export default ProtectedRoute;
