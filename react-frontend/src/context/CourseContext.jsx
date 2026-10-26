import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../services/api";


const CourseContext = createContext(null);


export function CourseProvider({ children }) {

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    async function fetchCourses() {

        try {

            setLoading(true);

            const response =
                await api.get("/api/courses");

            setCourses(response.data.data);
            setError(null);

        } catch (error) {

            console.error(
                "Failed to fetch courses:",
                error
            );

            setError(
                "Unable to load courses."
            );

        } finally {

            setLoading(false);
        }
    }


    useEffect(() => {

        fetchCourses();

    }, []);


    async function addCourse(courseData) {

        try {

            const response =
                await api.post(
                    "/api/courses",
                    courseData
                );

            const newCourse =
                response.data.data;

            setCourses(
                previousCourses => [
                    ...previousCourses,
                    newCourse
                ]
            );

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
                    `/api/courses/${id}`,
                    courseData
                );

            const updatedCourse =
                response.data.data;

            setCourses(
                previousCourses =>
                    previousCourses.map(course =>
                        course.id === id
                            ? updatedCourse
                            : course
                    )
            );

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
                `/api/courses/${id}`
            );

            setCourses(
                previousCourses =>
                    previousCourses.filter(
                        course =>
                            course.id !== id
                    )
            );

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


export function useCourses() {

    return useContext(
        CourseContext
    );
}
