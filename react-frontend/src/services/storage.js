/*
 * ------------------------------------------------------------
 * storage.js
 *
 * Everything the app keeps in localStorage goes through here,
 * so every page reads and writes the same shapes.
 *
 * Existing keys (unchanged):
 *   students, admins, courses, enrolledCourses, selectedCourse
 *
 * New key:
 *   notifications
 * ------------------------------------------------------------
 */

const COURSES = "courses";
const ENROLLED = "enrolledCourses";
const STUDENTS = "students";
const NOTIFICATIONS = "notifications";


// ------------------------------------------------------------
// LOW LEVEL HELPERS
// ------------------------------------------------------------

function readList(key) {

    try {

        const data =
            JSON.parse(
                localStorage.getItem(key) || "[]"
            );

        return Array.isArray(data)
            ? data
            : [];

    } catch {

        return [];
    }
}


function writeList(key, list) {

    localStorage.setItem(
        key,
        JSON.stringify(list)
    );
}


function sameEmail(first, second) {

    return (
        String(first || "").toLowerCase() ===
        String(second || "").toLowerCase()
    );
}


function sameId(first, second) {

    return String(first) === String(second);
}


// ------------------------------------------------------------
// COURSES
// ------------------------------------------------------------

/*
 * Used when a course has no modules of its own
 * (for example a course created with Add Course).
 */
export const DEFAULT_MODULES = [
    "Introduction",
    "Core Concepts",
    "Hands-on Practice",
    "Final Assessment"
];


/*
 * The three courses the original student.js shipped with.
 */
const DEFAULT_COURSES = [

    {
        id: "fullstack",
        title: "Full Stack Development",
        instructor: "John Smith",
        duration: "12 Weeks",
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
        title: "Python Programming",
        instructor: "Sarah Wilson",
        duration: "10 Weeks",
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
        title: "Artificial Intelligence",
        instructor: "David Brown",
        duration: "14 Weeks",
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


/*
 * Called once at startup. Only fills the list if the
 * browser has never had a "courses" entry, so courses
 * an admin has added or deleted are never overwritten.
 */
export function seedCourses() {

    if (localStorage.getItem(COURSES) === null) {

        writeList(COURSES, DEFAULT_COURSES);
    }
}


export function getCourses() {

    return readList(COURSES);
}


export function getCourse(id) {

    return getCourses().find(
        (course) => sameId(course.id, id)
    );
}


export function getModules(course) {

    if (
        course &&
        Array.isArray(course.modules) &&
        course.modules.length > 0
    ) {

        return course.modules;
    }

    return DEFAULT_MODULES;
}


/*
 * Deleting a course also removes its enrollments,
 * otherwise students would keep a course that no
 * longer exists.
 */
export function removeCourse(id) {

    writeList(
        COURSES,
        getCourses().filter(
            (course) => !sameId(course.id, id)
        )
    );

    writeList(
        ENROLLED,
        getEnrollments().filter(
            (enrollment) => !sameId(enrollment.id, id)
        )
    );
}


// ------------------------------------------------------------
// STUDENTS
// ------------------------------------------------------------

export function getStudents() {

    return readList(STUDENTS);
}


export function removeStudent(email) {

    writeList(
        STUDENTS,
        getStudents().filter(
            (student) => !sameEmail(student.email, email)
        )
    );

    writeList(
        ENROLLED,
        getEnrollments().filter(
            (enrollment) =>
                !sameEmail(enrollment.studentEmail, email)
        )
    );
}


// ------------------------------------------------------------
// ENROLLMENTS
//
// One entry per (student, course):
// {
//   id, title, description,      <- the course
//   studentEmail, studentName,   <- the student
//   enrolledDate,
//   completedModules: [0, 1, ...],
//   completedOn                  <- set when progress hits 100%
// }
// ------------------------------------------------------------

export function getEnrollments() {

    const courses = getCourses();

    // Show the course's current title/description, so an admin
    // editing a course is reflected for students who enrolled earlier.
    return readList(ENROLLED).map((enrollment) => {

        const course =
            courses.find(
                (item) => sameId(item.id, enrollment.id)
            );

        return course
            ? {
                ...enrollment,
                title: course.title,
                description: course.description
            }
            : enrollment;
    });
}


export function getStudentEnrollments(email) {

    return getEnrollments().filter(
        (enrollment) =>
            sameEmail(enrollment.studentEmail, email)
    );
}


export function getEnrollment(email, courseId) {

    return getEnrollments().find(
        (enrollment) =>
            sameEmail(enrollment.studentEmail, email) &&
            sameId(enrollment.id, courseId)
    );
}


export function enrollStudent(student, course) {

    const existing =
        getEnrollment(student.email, course.id);

    if (existing) {

        return {
            created: false,
            enrollment: existing
        };
    }

    const enrollment = {

        id: course.id,
        title: course.title,
        description: course.description,

        studentEmail: student.email,
        studentName: student.name,

        enrolledDate:
            new Date().toLocaleDateString(),

        completedModules: []
    };

    const list = getEnrollments();

    list.push(enrollment);

    writeList(ENROLLED, list);

    addNotification({
        studentEmail: student.email,
        title: "Enrollment successful",
        message:
            `You successfully enrolled in ${course.title}.`
    });

    return {
        created: true,
        enrollment
    };
}


export function removeEnrollment(email, courseId) {

    writeList(
        ENROLLED,
        getEnrollments().filter(
            (enrollment) =>
                !(
                    sameEmail(enrollment.studentEmail, email) &&
                    sameId(enrollment.id, courseId)
                )
        )
    );
}


/*
 * Progress as a whole number, 0-100.
 * The course is passed in by callers that already
 * have it, to avoid re-reading localStorage.
 */
export function getProgress(
    enrollment,
    course = getCourse(enrollment.id)
) {

    const total =
        getModules(course).length;

    const done =
        new Set(
            (enrollment.completedModules || []).filter(
                (index) => index >= 0 && index < total
            )
        ).size;

    return Math.round((done / total) * 100);
}


/*
 * A module unlocks when the one before it is complete
 * (same rule the original course-content page used).
 */
export function isModuleUnlocked(enrollment, index) {

    return (
        index === 0 ||
        (enrollment.completedModules || []).includes(index - 1)
    );
}


export function completeModule(email, courseId, index) {

    const list = getEnrollments();

    const position =
        list.findIndex(
            (enrollment) =>
                sameEmail(enrollment.studentEmail, email) &&
                sameId(enrollment.id, courseId)
        );

    if (position === -1) {

        return null;
    }

    const enrollment = list[position];

    const course = getCourse(courseId);

    const done =
        enrollment.completedModules || [];

    if (done.includes(index)) {

        return enrollment;
    }

    enrollment.completedModules =
        [...done, index];

    const progress =
        getProgress(enrollment, course);

    const title =
        course ? course.title : enrollment.title;

    if (progress === 100) {

        enrollment.completedOn =
            new Date().toLocaleDateString();
    }

    list[position] = enrollment;

    writeList(ENROLLED, list);

    addNotification({
        studentEmail: email,
        title: "Module completed",
        message:
            `You completed Module ${index + 1} of ${title}.`
    });

    if (progress === 100) {

        addNotification({
            studentEmail: email,
            title: "Course completed",
            message:
                `Congratulations! You finished ${title}. Your certificate is ready.`
        });
    }

    return enrollment;
}


// ------------------------------------------------------------
// NOTIFICATIONS
//
// audience:
//   "all"         every student
//   "<department>" students in that department
//   "student"     one student (studentEmail)
// ------------------------------------------------------------

export function getNotifications() {

    return readList(NOTIFICATIONS);
}


export function addNotification({
    title,
    message,
    audience = "student",
    studentEmail = "",
    type = "system"
}) {

    const list = getNotifications();

    list.push({
        id: `${Date.now()}-${list.length}`,
        type,
        title,
        message,
        audience,
        studentEmail,
        date: new Date().toISOString()
    });

    writeList(NOTIFICATIONS, list);
}


export function sendAdminNotification({
    title,
    message,
    audience
}) {

    addNotification({
        title,
        message,
        audience,
        type: "admin"
    });
}


export function getAdminNotifications() {

    return getNotifications()
        .filter((item) => item.type === "admin")
        .reverse();
}


export function getNotificationsForStudent(student) {

    return getNotifications()
        .filter((item) => {

            if (item.audience === "all") {

                return true;
            }

            if (item.audience === "student") {

                return sameEmail(
                    item.studentEmail,
                    student.email
                );
            }

            return item.audience === student.department;
        })
        .reverse();
}


// ------------------------------------------------------------
// REPORTS
// ------------------------------------------------------------

export function getCourseReport() {

    const enrollments = getEnrollments();

    return getCourses().map((course) => {

        const list =
            enrollments.filter(
                (enrollment) =>
                    sameId(enrollment.id, course.id)
            );

        const completed =
            list.filter(
                (enrollment) =>
                    getProgress(enrollment, course) === 100
            ).length;

        return {
            course,
            students: list.length,
            completed,
            rate:
                list.length === 0
                    ? 0
                    : Math.round(
                        (completed / list.length) * 100
                    )
        };
    });
}


export function getCertificateCount() {

    return getEnrollments().filter(
        (enrollment) =>
            getProgress(enrollment) === 100
    ).length;
}
