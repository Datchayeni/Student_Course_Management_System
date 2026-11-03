/*
 * In-memory course data for the API.
 *
 * These are the same three courses already built into the React app
 * (see react-frontend/src/services/storage.js -> DEFAULT_COURSES), using
 * the same ids, so /course-details/:id, /start-course/:id etc. keep
 * working for courses the student enrolls in via this API.
 */
const courses = [

    {
        id: "fullstack",
        courseName: "Full Stack Development",
        courseCode: "FS101",
        instructor: "John Smith",
        duration: "12 Weeks",
        level: "Beginner",
        category: "Web Development",
        image: "https://cdn-icons-png.flaticon.com/512/1006/1006363.png",
        status: "Active",
        description:
            "Learn HTML, CSS, JavaScript, React, Node.js and MongoDB.",
        modules: [
            "HTML Basics",
            "CSS Fundamentals",
            "Bootstrap 5",
            "JavaScript Basics",
            "React JS",
            "Node.js & MongoDB"
        ]
    },

    {
        id: "python",
        courseName: "Python Programming",
        courseCode: "CS101",
        instructor: "Sarah Wilson",
        duration: "10 Weeks",
        level: "Beginner",
        category: "Programming",
        image: "https://cdn-icons-png.flaticon.com/512/5968/5968350.png",
        status: "Active",
        description:
            "Learn Python programming from beginner to advanced.",
        modules: [
            "Python Introduction",
            "Variables & Data Types",
            "Operators",
            "Conditional Statements",
            "Loops",
            "Functions",
            "Lists & Dictionaries",
            "File Handling"
        ]
    },

    {
        id: "ai",
        courseName: "Artificial Intelligence",
        courseCode: "AI101",
        instructor: "David Brown",
        duration: "14 Weeks",
        level: "Advanced",
        category: "Artificial Intelligence",
        image: "https://cdn-icons-png.flaticon.com/512/4712/4712027.png",
        status: "Active",
        description:
            "Learn AI, Machine Learning and Deep Learning fundamentals.",
        modules: [
            "AI Fundamentals",
            "Python for AI",
            "Machine Learning",
            "Supervised Learning",
            "Unsupervised Learning",
            "Neural Networks",
            "Deep Learning",
            "AI Applications"
        ]
    }

];

module.exports = courses;
