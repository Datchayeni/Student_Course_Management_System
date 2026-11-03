import {
    Navigate,
    Outlet,
    useLocation
} from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import { getToken } from "../api/apiClient";


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


    // Students are authenticated by the backend, so besides the saved
    // profile they must still hold a JWT (it is removed on logout and
    // when it expires).
    const allowed =
        role === "admin"
            ? loggedInAdmin && getToken()
            : loggedInStudent && getToken();


    if (allowed) {

        return <Outlet />;
    }


    if (role === "admin" && loggedInStudent) {

        return (
            <Navigate
                to="/student-dashboard"
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
