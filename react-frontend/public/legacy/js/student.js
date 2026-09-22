// ============================================================
// EDUTRACK - STUDENT.JS
// Handles all student-side dynamic features
// ============================================================


// ============================================================
// 1. COURSE DATA
// ============================================================

const courses = {

    fullstack: {
        id: "fullstack",
        name: "Full Stack Development",
        instructor: "John Smith",
        duration: "12 Weeks",
        image: "../images/course1.jpg",

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


    python: {
        id: "python",
        name: "Python Programming",
        instructor: "Sarah Wilson",
        duration: "10 Weeks",
        image: "../images/course2.jpg",

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


    ai: {
        id: "ai",
        name: "Artificial Intelligence",
        instructor: "David Brown",
        duration: "14 Weeks",
        image: "../images/course3.jpg",

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

};


// ============================================================
// 2. HELPER FUNCTIONS
// ============================================================


// Get current logged-in student

function getCurrentStudent() {

    const user =
        localStorage.getItem(
            "eduTrackCurrentUser"
        );

    return user
        ? JSON.parse(user)
        : null;

}


// Get all enrollments

function getEnrollments() {

    return JSON.parse(
        localStorage.getItem("eduTrackEnrollments")
    ) || [];

}


// Save enrollments

function saveEnrollments(enrollments) {

    localStorage.setItem(
        "eduTrackEnrollments",
        JSON.stringify(enrollments)
    );

}


// Get course ID from URL

function getCourseIdFromURL() {

    const params = new URLSearchParams(
        window.location.search
    );

    return params.get("course");

}


// ============================================================
// 3. STUDENT PAGE PROTECTION
// ============================================================

function protectStudentPage() {

    const student = getCurrentStudent();

    if (!student) {

        alert("Please login as a student first.");

        window.location.href =
            "../auth/login.html";

    }

}


// Run protection on student pages

if (
    window.location.pathname.includes("/student/")
) {

    protectStudentPage();

}


// ============================================================
// 4. COURSE SEARCH
// ============================================================

const courseSearch =
    document.getElementById("courseSearch");

const courseItems =
    document.querySelectorAll(".course-item");

const noCourses =
    document.getElementById("noCourses");


if (courseSearch) {

    courseSearch.addEventListener(
        "input",
        function () {

            const searchText =
                courseSearch.value
                    .toLowerCase()
                    .trim();

            let found = false;


            courseItems.forEach(function (item) {

                const courseName =
                    item.dataset.courseName
                        .toLowerCase();


                if (
                    courseName.includes(searchText)
                ) {

                    item.style.display = "";

                    found = true;

                } else {

                    item.style.display = "none";

                }

            });


            if (noCourses) {

                noCourses.style.display =
                    found ? "none" : "block";

            }

        }
    );

}


// ============================================================
// 5. ENROLL IN COURSE
// ============================================================

const enrollButtons =
    document.querySelectorAll(".enroll-btn");


enrollButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            const student =
                getCurrentStudent();


            if (!student) {

                alert(
                    "Please login as a student first."
                );

                window.location.href =
                    "../auth/login.html";

                return;

            }


            const courseId =
                button.dataset.courseId;

            const courseName =
                button.dataset.courseName;


            let enrollments =
                getEnrollments();


            // Check duplicate enrollment

            const alreadyEnrolled =
                enrollments.some(
                    function (enrollment) {

                        return (
                            enrollment.email
                                .toLowerCase() ===
                            student.email
                                .toLowerCase()
                            &&
                            enrollment.courseId ===
                            courseId
                        );

                    }
                );


            if (alreadyEnrolled) {

                alert(
                    "You are already enrolled in " +
                    courseName
                );

                return;

            }


            // Create enrollment

            const enrollment = {

                email: student.email,

                courseId: courseId,

                courseName: courseName,

                enrolledDate:
                    new Date().toLocaleDateString(),

                completedModules: [],

                progress: 0

            };


            enrollments.push(enrollment);

            saveEnrollments(enrollments);


            // Create notification

            addNotification(
                "You successfully enrolled in " +
                courseName + "."
            );


            alert(
                "Successfully enrolled in " +
                courseName + "!"
            );


            window.location.href =
                "my-courses.html";

        }
    );

});


// ============================================================
// 6. MY COURSES
// ============================================================

const myCoursesContainer =
    document.getElementById(
        "myCoursesContainer"
    );

const noCoursesMessage =
    document.getElementById(
        "noCoursesMessage"
    );


if (myCoursesContainer) {

    loadMyCourses();

}


function loadMyCourses() {

    const student =
        getCurrentStudent();


    if (!student) {

        return;

    }


    const enrollments =
        getEnrollments();


    const studentCourses =
        enrollments.filter(
            function (enrollment) {

                return (
                    enrollment.email
                        .toLowerCase() ===
                    student.email
                        .toLowerCase()
                );

            }
        );


    myCoursesContainer.innerHTML = "";


    if (studentCourses.length === 0) {

        if (noCoursesMessage) {

            noCoursesMessage.style.display =
                "block";

        }

        return;

    }


    if (noCoursesMessage) {

        noCoursesMessage.style.display =
            "none";

    }


    studentCourses.forEach(
        function (enrollment) {

            const course =
                courses[enrollment.courseId];


            if (!course) {

                return;

            }


            const progress =
                calculateProgress(
                    enrollment,
                    course
                );


            const card =
                document.createElement("div");


            card.className =
                "col-lg-6 col-md-6";


            card.innerHTML = `

                <div class="card course-card h-100">

                    <img
                        src="${course.image}"
                        class="card-img-top"
                        alt="${course.name}">

                    <div class="card-body">

                        <h4>
                            ${course.name}
                        </h4>

                        <p>
                            ${course.description}
                        </p>

                        <h6>
                            Progress
                        </h6>

                        <div class="progress mb-3">

                            <div
                                class="progress-bar"
                                style="width:${progress}%">

                                ${progress}%

                            </div>

                        </div>

                        <p>

                            <strong>
                                Instructor:
                            </strong>

                            ${course.instructor}

                        </p>

                    </div>

                    <div
                        class="card-footer bg-white border-0">

                        <a
                            href="course-content.html?course=${course.id}"
                            class="btn btn-primary">

                            Continue Learning

                        </a>

                    </div>

                </div>

            `;


            myCoursesContainer.appendChild(card);

        }
    );

}


// ============================================================
// 7. CALCULATE COURSE PROGRESS
// ============================================================

function calculateProgress(
    enrollment,
    course
) {

    const completed =
        enrollment.completedModules
            ? enrollment.completedModules.length
            : 0;


    const total =
        course.modules.length;


    if (total === 0) {

        return 0;

    }


    return Math.round(
        (completed / total) * 100
    );

}


// ============================================================
// 8. COURSE DETAILS
// ============================================================

const courseDetailsContainer =
    document.getElementById(
        "courseDetailsContainer"
    );


if (courseDetailsContainer) {

    loadCourseDetails();

}


function loadCourseDetails() {

    const courseId =
        getCourseIdFromURL();


    const course =
        courses[courseId];


    if (!course) {

        courseDetailsContainer.innerHTML = `

            <div class="alert alert-danger">

                Course not found.

            </div>

        `;

        return;

    }


    courseDetailsContainer.innerHTML = `

        <div class="card shadow">

            <img
                src="${course.image}"
                class="card-img-top"
                alt="${course.name}">

            <div class="card-body p-4">

                <h2>
                    ${course.name}
                </h2>

                <p class="text-muted">

                    Instructor:
                    ${course.instructor}

                    |
                    Duration:
                    ${course.duration}

                </p>

                <p>
                    ${course.description}
                </p>

                <h5>
                    Course Modules
                </h5>

                <ul>

                    ${course.modules
                        .map(
                            function (module, index) {

                                return `
                                    <li>
                                        Module ${index + 1}
                                        -
                                        ${module}
                                    </li>
                                `;

                            }
                        )
                        .join("")}

                </ul>

                <button
                    class="btn btn-primary"
                    id="dynamicEnrollButton"
                    data-course-id="${course.id}">

                    Enroll Now

                </button>

            </div>

        </div>

    `;


    const button =
        document.getElementById(
            "dynamicEnrollButton"
        );


    if (button) {

        button.addEventListener(
            "click",
            function () {

                enrollCourse(course.id);

            }
        );

    }

}


// ============================================================
// 9. DYNAMIC ENROLLMENT FROM COURSE DETAILS
// ============================================================

function enrollCourse(courseId) {

    const student =
        getCurrentStudent();


    if (!student) {

        alert(
            "Please login as a student first."
        );

        window.location.href =
            "../auth/login.html";

        return;

    }


    const course =
        courses[courseId];


    if (!course) {

        alert("Course not found.");

        return;

    }


    let enrollments =
        getEnrollments();


    const alreadyEnrolled =
        enrollments.some(
            function (enrollment) {

                return (
                    enrollment.email
                        .toLowerCase() ===
                    student.email
                        .toLowerCase()
                    &&
                    enrollment.courseId ===
                    courseId
                );

            }
        );


    if (alreadyEnrolled) {

        alert(
            "You are already enrolled in this course."
        );

        return;

    }


    enrollments.push({

        email: student.email,

        courseId: courseId,

        courseName: course.name,

        enrolledDate:
            new Date().toLocaleDateString(),

        completedModules: [],

        progress: 0

    });


    saveEnrollments(enrollments);


    addNotification(
        "You successfully enrolled in " +
        course.name + "."
    );


    alert(
        "Enrollment successful!"
    );


    window.location.href =
        "my-courses.html";

}


// ============================================================
// 10. COURSE CONTENT
// ============================================================

const moduleList =
    document.getElementById(
        "moduleList"
    );


if (moduleList) {

    loadCourseContent();

}


function loadCourseContent() {

    const courseId =
        getCourseIdFromURL();


    const course =
        courses[courseId];


    if (!course) {

        return;

    }


    const student =
        getCurrentStudent();


    if (!student) {

        return;

    }


    const enrollments =
        getEnrollments();


    const enrollment =
        enrollments.find(
            function (item) {

                return (
                    item.email
                        .toLowerCase() ===
                    student.email
                        .toLowerCase()
                    &&
                    item.courseId ===
                    courseId
                );

            }
        );


    if (!enrollment) {

        alert(
            "You are not enrolled in this course."
        );

        window.location.href =
            "browse-courses.html";

        return;

    }


    moduleList.innerHTML = "";


    course.modules.forEach(
        function (module, index) {

            const completed =
                enrollment.completedModules
                    .includes(index);


            const previousCompleted =
                index === 0 ||
                enrollment.completedModules
                    .includes(index - 1);


            const unlocked =
                previousCompleted;


            const item =
                document.createElement("a");


            item.className =
                "list-group-item list-group-item-action d-flex justify-content-between align-items-center";


            if (!unlocked) {

                item.classList.add(
                    "disabled"
                );

            }


            let statusText = "Locked";

            let badgeClass =
                "bg-secondary";


            if (completed) {

                statusText = "Completed";

                badgeClass =
                    "bg-success";

            } else if (unlocked) {

                statusText = "Continue";

                badgeClass =
                    "bg-warning text-dark";

            }


            item.innerHTML = `

                <div>

                    <h5>
                        Module ${index + 1}
                        -
                        ${module}
                    </h5>

                    <small>
                        ${statusText}
                    </small>

                </div>

                <span
                    class="badge ${badgeClass}">

                    ${
                        completed
                        ? '<i class="bi bi-check-circle-fill"></i>'
                        : statusText
                    }

                </span>

            `;


            if (unlocked) {

                item.href =
                    `module.html?course=${courseId}&module=${index}`;

            }


            moduleList.appendChild(item);

        }
    );


    updateProgressDisplay(
        enrollment,
        course
    );

}


// ============================================================
// 11. MODULE PAGE
// ============================================================

const markCompleteButton =
    document.getElementById(
        "markCompleteBtn"
    );


if (markCompleteButton) {

    setupModulePage();

}


function setupModulePage() {

    const courseId =
        getCourseIdFromURL();


    const params =
        new URLSearchParams(
            window.location.search
        );


    const moduleIndex =
        parseInt(
            params.get("module")
        );


    const course =
        courses[courseId];


    if (
        !course ||
        isNaN(moduleIndex) ||
        !course.modules[moduleIndex]
    ) {

        return;

    }


    const moduleTitle =
        document.getElementById(
            "moduleTitle"
        );


    if (moduleTitle) {

        moduleTitle.textContent =
            "Module " +
            (moduleIndex + 1) +
            " - " +
            course.modules[moduleIndex];

    }


    markCompleteButton.addEventListener(
        "click",
        function () {

            markModuleComplete(
                courseId,
                moduleIndex
            );

        }
    );

}


// ============================================================
// 12. MARK MODULE COMPLETE
// ============================================================

function markModuleComplete(
    courseId,
    moduleIndex
) {

    const student =
        getCurrentStudent();


    if (!student) {

        return;

    }


    let enrollments =
        getEnrollments();


    const enrollmentIndex =
        enrollments.findIndex(
            function (item) {

                return (
                    item.email
                        .toLowerCase() ===
                    student.email
                        .toLowerCase()
                    &&
                    item.courseId ===
                    courseId
                );

            }
        );


    if (enrollmentIndex === -1) {

        alert(
            "You are not enrolled in this course."
        );

        return;

    }


    const enrollment =
        enrollments[enrollmentIndex];


    if (
        !enrollment.completedModules
    ) {

        enrollment.completedModules =
            [];

    }


    if (
        !enrollment.completedModules
            .includes(moduleIndex)
    ) {

        enrollment.completedModules.push(
            moduleIndex
        );

    }


    const course =
        courses[courseId];


    enrollment.progress =
        calculateProgress(
            enrollment,
            course
        );


    enrollments[enrollmentIndex] =
        enrollment;


    saveEnrollments(enrollments);


    addNotification(
        "You completed Module " +
        (moduleIndex + 1) +
        " of " +
        course.name + "."
    );


    alert(
        "Module completed!"
    );


    window.location.href =
        `course-content.html?course=${courseId}`;

}


// ============================================================
// 13. UPDATE PROGRESS DISPLAY
// ============================================================

function updateProgressDisplay(
    enrollment,
    course
) {

    const progress =
        calculateProgress(
            enrollment,
            course
        );


    const progressBars =
        document.querySelectorAll(
            ".progress-bar"
        );


    progressBars.forEach(
        function (bar) {

            bar.style.width =
                progress + "%";

            bar.textContent =
                progress + "% Completed";

        }
    );

}


// ============================================================
// 14. NOTIFICATIONS
// ============================================================

function getNotifications() {

    return JSON.parse(
        localStorage.getItem(
            "eduTrackNotifications"
        )
    ) || [];

}


function addNotification(message) {

    const student =
        getCurrentStudent();


    if (!student) {

        return;

    }


    let notifications =
        getNotifications();


    notifications.push({

        email: student.email,

        message: message,

        date:
            new Date().toLocaleString(),

        read: false

    });


    localStorage.setItem(
        "eduTrackNotifications",
        JSON.stringify(
            notifications
        )
    );

}


// ============================================================
// 15. DISPLAY NOTIFICATIONS
// ============================================================

const notificationContainer =
    document.getElementById(
        "notificationContainer"
    );


if (notificationContainer) {

    loadNotifications();

}


function loadNotifications() {

    const student =
        getCurrentStudent();


    if (!student) {

        return;

    }


    const notifications =
        getNotifications();


    const studentNotifications =
        notifications.filter(
            function (notification) {

                return (
                    notification.email
                        .toLowerCase() ===
                    student.email
                        .toLowerCase()
                );

            }
        );


    notificationContainer.innerHTML = "";


    if (
        studentNotifications.length === 0
    ) {

        notificationContainer.innerHTML = `

            <div class="text-center py-5">

                <i class="bi bi-bell fs-1"></i>

                <h5 class="mt-3">
                    No Notifications
                </h5>

                <p class="text-muted">
                    You don't have any notifications yet.
                </p>

            </div>

        `;

        return;

    }


    studentNotifications
        .reverse()
        .forEach(
            function (notification) {

                const item =
                    document.createElement("div");


                item.className =
                    "alert alert-light border";


                item.innerHTML = `

                    <strong>
                        <i class="bi bi-bell-fill"></i>
                        EduTrack
                    </strong>

                    <p class="mb-1 mt-2">
                        ${notification.message}
                    </p>

                    <small class="text-muted">
                        ${notification.date}
                    </small>

                `;


                notificationContainer
                    .appendChild(item);

            }
        );

}


// ============================================================
// PROFILE PAGE
// ============================================================

const profileName =
    document.getElementById("profileName");

const profileFullName =
    document.getElementById("profileFullName");

const profileStudentID =
    document.getElementById("profileStudentID");

const profileEmail =
    document.getElementById("profileEmail");

const profileDepartment =
    document.getElementById("profileDepartment");

const profileYear =
    document.getElementById("profileYear");

const profileRole =
    document.getElementById("profileRole");

const profileAccountType =
    document.getElementById("profileAccountType");


if (profileName) {

    loadStudentProfile();

}


function loadStudentProfile() {

    const student =
        getCurrentStudent();


    if (!student) {

        return;

    }


    // Display name

    if (profileName) {

        profileName.textContent =
            student.name || "-";

    }


    // Full name

    if (profileFullName) {

        profileFullName.textContent =
            student.name || "-";

    }


    // Student ID

    if (profileStudentID) {

        profileStudentID.textContent =
            student.studentID || "-";

    }


    // Email

    if (profileEmail) {

        profileEmail.textContent =
            student.email || "-";

    }


    // Department

    if (profileDepartment) {

        profileDepartment.textContent =
            student.department || "-";

    }


    // Academic year

    if (profileYear) {

        profileYear.textContent =
            student.year || "-";

    }


    // Role

    if (profileRole) {

        profileRole.textContent =
            student.role || "student";

    }


    // Account type

    if (profileAccountType) {

        profileAccountType.textContent =
            student.role === "student"
                ? "Student"
                : student.role;

    }

}


// ============================================================
// 16. LOGOUT
// ============================================================

const logoutButton =
    document.getElementById(
        "logoutBtn"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {

                return;

            }


            localStorage.removeItem(
                "eduTrackCurrentUser"
            );


            window.location.href =
                "../auth/login.html";

        }
    );

}


// ============================================================
// 17. CERTIFICATE CHECK
// ============================================================

function isCourseCompleted(
    enrollment,
    course
) {

    return (
        calculateProgress(
            enrollment,
            course
        ) === 100
    );

}


// ============================================================
// 18. CERTIFICATE DOWNLOAD
// ============================================================

const certificateButton =
    document.getElementById(
        "certificateBtn"
    );


if (certificateButton) {

    certificateButton.addEventListener(
        "click",
        function () {

            downloadCertificate();

        }
    );

}


function downloadCertificate() {

    const student =
        getCurrentStudent();


    if (!student) {

        return;

    }


    const courseId =
        getCourseIdFromURL();


    const course =
        courses[courseId];


    if (!course) {

        alert(
            "Course not found."
        );

        return;

    }


    const enrollments =
        getEnrollments();


    const enrollment =
        enrollments.find(
            function (item) {

                return (
                    item.email
                        .toLowerCase() ===
                    student.email
                        .toLowerCase()
                    &&
                    item.courseId ===
                    courseId
                );

            }
        );


    if (!enrollment) {

        alert(
            "You are not enrolled in this course."
        );

        return;

    }


    if (
        !isCourseCompleted(
            enrollment,
            course
        )
    ) {

        alert(
            "Complete all modules to download your certificate."
        );

        return;

    }


    const certificateContent = `

        EDUTRACK

        CERTIFICATE OF COMPLETION


        This certificate is proudly presented to


        ${student.name || "Student"}


        for successfully completing


        ${course.name}


        Instructor: ${course.instructor}


        Date:
        ${new Date().toLocaleDateString()}


        Congratulations!

    `;


    const blob =
        new Blob(
            [certificateContent],
            {
                type: "text/plain"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        course.name
            .replace(/\s+/g, "_")
        +
        "_Certificate.txt";


    link.click();


    URL.revokeObjectURL(url);

}