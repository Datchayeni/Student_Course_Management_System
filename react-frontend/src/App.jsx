import {
    Routes,
    Route
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

/* PUBLIC */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminRegister from "./pages/AdminRegister";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

/* STUDENT */
import StudentDashboard from "./pages/StudentDashboard";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import EnrollmentSuccess from "./pages/EnrollmentSuccess";
import MyCourses from "./pages/MyCourses";
import StartCourse from "./pages/StartCourse";
import CourseContent from "./pages/CourseContent";
import Module from "./pages/Module";
import VideoPlayer from "./pages/VideoPlayer";
import Materials from "./pages/Materials";
import Progress from "./pages/Progress";
import Certificate from "./pages/Certificate";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

/* ADMIN */
import AdminDashboard from "./pages/AdminDashboard";
import AdminCourses from "./pages/AdminCourses";
import AddCourse from "./pages/AddCourse";
import EditCourse from "./pages/EditCourse";
import AdminStudents from "./pages/AdminStudents";
import ManageEnrollment from "./pages/ManageEnrollment";
import AdminNotifications from "./pages/AdminNotifications";
import AdminReports from "./pages/AdminReports";


function App() {

    return (

        <Routes>

            {/* ============================================
                PUBLIC ROUTES
               ============================================ */}

            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/admin-register"
                element={<AdminRegister />}
            />

            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />

            <Route
                path="/reset-password"
                element={<ResetPassword />}
            />


            {/* ============================================
                STUDENT ROUTES (student login required)
               ============================================ */}

            <Route element={<ProtectedRoute role="student" />}>

                <Route
                    path="/dashboard"
                    element={<StudentDashboard />}
                />

                <Route
                    path="/courses"
                    element={<Courses />}
                />

                <Route
                    path="/course-details/:id"
                    element={<CourseDetails />}
                />

                <Route
                    path="/enrollment-success"
                    element={<EnrollmentSuccess />}
                />

                <Route
                    path="/my-courses"
                    element={<MyCourses />}
                />

                <Route
                    path="/start-course/:id"
                    element={<StartCourse />}
                />

                <Route
                    path="/course-content/:id"
                    element={<CourseContent />}
                />

                <Route
                    path="/module/:id/:moduleIndex"
                    element={<Module />}
                />

                <Route
                    path="/video-player/:id/:moduleIndex"
                    element={<VideoPlayer />}
                />

                <Route
                    path="/materials/:id/:moduleIndex"
                    element={<Materials />}
                />

                <Route
                    path="/progress"
                    element={<Progress />}
                />

                <Route
                    path="/certificate"
                    element={<Certificate />}
                />

                <Route
                    path="/certificate/:id"
                    element={<Certificate />}
                />

                <Route
                    path="/notifications"
                    element={<Notifications />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />

            </Route>


            {/* ============================================
                ADMIN ROUTES (admin login required)
               ============================================ */}

            <Route element={<ProtectedRoute role="admin" />}>

                <Route
                    path="/admin-dashboard"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/admin-courses"
                    element={<AdminCourses />}
                />

                <Route
                    path="/add-course"
                    element={<AddCourse />}
                />

                <Route
                    path="/edit-course/:id"
                    element={<EditCourse />}
                />

                <Route
                    path="/admin-students"
                    element={<AdminStudents />}
                />

                <Route
                    path="/manage-enrollment"
                    element={<ManageEnrollment />}
                />

                <Route
                    path="/admin-notifications"
                    element={<AdminNotifications />}
                />

                <Route
                    path="/admin-reports"
                    element={<AdminReports />}
                />

            </Route>


            {/* ============================================
                404
               ============================================ */}

            <Route
                path="*"
                element={<NotFound />}
            />

        </Routes>
    );
}


export default App;
