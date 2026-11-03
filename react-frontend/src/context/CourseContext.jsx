import {
    createContext,
    useContext,
    useState
} from "react";

import api from "../services/api";
import {
    getCourses,
    removeCourse as removeLocalCourse,
    upsertCourses
} from "../services/storage";


const CourseContext = createContext(null);


/*
 * The backend (MongoDB) uses `_id`; the rest of the React app
 * (storage.js, student pages) uses `id`. Convert once, here.
 */
function normalizeCourse(course) {

    return {
        ...course,
        id: String(course._id || course.id)
    };
}


export function CourseProvider({ children }) {

    // Always the merged list kept in localStorage, so the student
    // pages (details, enroll, progress...) can find every course.
    const [courses, setCourses] = useState(() => getCourses());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    async function fetchCourses() {

        try {

            setLoading(true);

            // GET /api/v1/courses  (baseURL already ends with /api/v1)
            const response =
                await api.get("/courses");

            upsertCourses(
                (response.data.data || []).map(normalizeCourse)
            );

            setError(null);

        } catch (error) {

            console.error(
                "Failed to fetch courses:",
                error
            );

            setError(
                "Could not reach the server. Showing saved courses."
            );

        } finally {

            setCourses(getCourses());
            setLoading(false);
        }
    }


    async function addCourse(courseData) {

        try {

            const response =
                await api.post(
                    "/courses",
                    courseData
                );

            const newCourse =
                normalizeCourse(response.data.data);

            upsertCourses([newCourse]);
            setCourses(getCourses());

            return newCourse;

        } catch (error) {

            console.error(
                "Error adding course:",
                error
            );

            throw error;
        }
    }


    async function updateCourse(
        id,
        courseData
    ) {

        try {

            const response =
                await api.put(
                    `/courses/${id}`,
                    courseData
                );

            const updatedCourse =
                normalizeCourse(response.data.data);

            upsertCourses([updatedCourse]);
            setCourses(getCourses());

            return updatedCourse;

        } catch (error) {

            console.error(
                "Error updating course:",
                error
            );

            throw error;
        }
    }


    async function deleteCourse(id) {

        try {

            await api.delete(
                `/courses/${id}`
            );

            removeLocalCourse(id);
            setCourses(getCourses());

        } catch (error) {

            console.error(
                "Error deleting course:",
                error
            );

            throw error;
        }
    }


    return (
        <CourseContext.Provider
            value={{
                courses,
                loading,
                error,
                fetchCourses,
                addCourse,
                updateCourse,
                deleteCourse
            }}
        >
            {children}
        </CourseContext.Provider>
    );
}


// eslint-disable-next-line react-refresh/only-export-components
export function useCourses() {

    return useContext(
        CourseContext
    );
}
