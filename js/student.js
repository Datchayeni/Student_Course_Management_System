// ==========================================
// STUDENT.JS
// ==========================================


// ==========================================
// CHECK STUDENT LOGIN
// ==========================================

function checkStudentLogin() {

    const currentUser =
        JSON.parse(
            localStorage.getItem("eduTrackCurrentUser")
        );

    if (!currentUser) {

        alert("Please login to continue.");

        window.location.href =
            "../auth/login.html";

        return null;
    }

    if (currentUser.role !== "student") {

        alert("Access denied. Student account required.");

        window.location.href =
            "../auth/login.html";

        return null;
    }

    return currentUser;
}


const currentStudent = checkStudentLogin();


// ==========================================
// SEARCH COURSES
// ==========================================

const courseSearch =
    document.getElementById("courseSearch");

if (courseSearch) {

    courseSearch.addEventListener(
        "input",
        function () {

            const searchText =
                this.value.toLowerCase().trim();

            const courses =
                document.querySelectorAll(".course-item");

            let foundCourses = 0;


            courses.forEach(function (course) {

                const courseName =
                    course.dataset.courseName.toLowerCase();

                if (courseName.includes(searchText)) {

                    course.style.display = "";

                    foundCourses++;

                } else {

                    course.style.display = "none";

                }

            });


            // Show / hide no result message

            const noCourses =
                document.getElementById("noCourses");

            if (noCourses) {

                if (foundCourses === 0) {

                    noCourses.style.display = "block";

                } else {

                    noCourses.style.display = "none";

                }

            }

        }
    );
}


// ==========================================
// ENROLL COURSE
// ==========================================

const enrollButtons =
    document.querySelectorAll(".enroll-btn");


enrollButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            if (!currentStudent) {
                return;
            }


            const courseId =
                this.dataset.courseId;

            const courseName =
                this.dataset.courseName;


            // Get existing enrollments

            let enrollments =
                JSON.parse(
                    localStorage.getItem("eduTrackEnrollments")
                ) || [];


            // Check whether already enrolled

            const alreadyEnrolled =
                enrollments.some(function (enrollment) {

                    return enrollment.email ===
                        currentStudent.email &&
                        enrollment.courseId ===
                        courseId;

                });


            if (alreadyEnrolled) {

                alert(
                    "You are already enrolled in " +
                    courseName + "."
                );

                return;
            }


            // Create enrollment

            const newEnrollment = {

                email: currentStudent.email,

                courseId: courseId,

                courseName: courseName,

                progress: 0,

                completedModules: [],

                enrolledDate:
                    new Date().toLocaleDateString()

            };


            // Add enrollment

            enrollments.push(newEnrollment);


            // Save

            localStorage.setItem(
                "eduTrackEnrollments",
                JSON.stringify(enrollments)
            );


            alert(
                "Successfully enrolled in " +
                courseName + "!"
            );


            // Go to enrollment success page

            window.location.href =
                "enrollment-success.html?course=" +
                courseId;

        }
    );

});


// ==========================================
// LOGOUT
// ==========================================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
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


            // Remove logged-in user

            localStorage.removeItem(
                "eduTrackCurrentUser"
            );


            // Go to login

            window.location.href =
                "../auth/login.html";

        }
    );

}

// ==========================================
// MY COURSES
// ==========================================

const myCoursesContainer =
    document.getElementById("myCoursesContainer");

const noCoursesMessage =
    document.getElementById("noCoursesMessage");


if (myCoursesContainer && currentStudent) {

    // Get all enrollments

    const enrollments =
        JSON.parse(
            localStorage.getItem("eduTrackEnrollments")
        ) || [];


    // Get only current student's courses

    const myEnrollments =
        enrollments.filter(function (enrollment) {

            return enrollment.email.toLowerCase() ===
                currentStudent.email.toLowerCase();

        });


    // No courses

    if (myEnrollments.length === 0) {

        noCoursesMessage.style.display = "block";

    }


    // Display courses

    myEnrollments.forEach(function (enrollment) {

        let image = "../images/course1.jpg";

        let description =
            "Continue learning and improve your skills.";


        // Course-specific information

        if (enrollment.courseId === "fullstack") {

            image = "../images/course1.jpg";

            description =
                "Learn HTML, CSS, Bootstrap, JavaScript, React, Node.js and MongoDB.";

        }


        else if (enrollment.courseId === "python") {

            image = "../images/course2.jpg";

            description =
                "Master Python programming from beginner to advanced level.";

        }


        else if (enrollment.courseId === "ai") {

            image = "../images/course3.jpg";

            description =
                "Learn Artificial Intelligence, Machine Learning and Deep Learning.";

        }


        // Progress

        const progress =
            enrollment.progress || 0;


        // Create course card

        const courseCard = document.createElement("div");

        courseCard.className =
            "col-lg-6";


        courseCard.innerHTML = `

            <div class="card course-card h-100">

                <img src="${image}"
                    class="card-img-top"
                    alt="${enrollment.courseName}">


                <div class="card-body">

                    <h4>
                        ${enrollment.courseName}
                    </h4>


                    <p>
                        ${description}
                    </p>


                    <h6>
                        Progress
                    </h6>


                    <div class="progress mb-3">

                        <div class="progress-bar"
                            style="width:${progress}%">

                            ${progress}%

                        </div>

                    </div>


                    <p>

                        <strong>
                            Enrolled Date:
                        </strong>

                        ${enrollment.enrolledDate}

                    </p>


                </div>


                <div class="card-footer bg-white border-0">

                    <button
                        class="btn btn-primary continue-btn"
                        data-course-id="${enrollment.courseId}">

                        Continue Learning

                    </button>

                </div>

            </div>

        `;


        myCoursesContainer.appendChild(courseCard);

    });


    // Continue Learning buttons

    const continueButtons =
        document.querySelectorAll(".continue-btn");


    continueButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const courseId =
                    this.dataset.courseId;


                // Store selected course

                localStorage.setItem(
                    "eduTrackSelectedCourse",
                    courseId
                );


                // Go to course content

                window.location.href =
                    "course-content.html";

            }
        );

    });

}