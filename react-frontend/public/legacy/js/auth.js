// ==========================================
// EDUTRACK AUTHENTICATION
// LOCAL STORAGE
// ==========================================


// ==========================================
// PASSWORD VALIDATION
// ==========================================

function isValidPassword(password) {

    const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/;

    return passwordPattern.test(password);
}


// ==========================================
// GET USERS
// ==========================================

function getUsers() {

    const users =
        localStorage.getItem("eduTrackUsers");

    return users
        ? JSON.parse(users)
        : [];
}


// ==========================================
// SAVE USERS
// ==========================================

function saveUsers(users) {

    localStorage.setItem(
        "eduTrackUsers",
        JSON.stringify(users)
    );
}


// ==========================================
// STUDENT REGISTRATION
// ==========================================

const studentRegisterForm =
    document.getElementById("studentRegisterForm");

if (studentRegisterForm) {

    studentRegisterForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            // Get student details

            const name =
                document.getElementById("studentName").value.trim();

            const studentID =
                document.getElementById("studentID").value.trim();

            const email =
                document.getElementById("studentEmail").value.trim();

            const department =
                document.getElementById("studentDepartment").value;

            const year =
                document.getElementById("studentYear").value;

            const password =
                document.getElementById("studentPassword").value;

            const confirmPassword =
                document.getElementById(
                    "studentConfirmPassword"
                ).value;

            const terms =
                document.getElementById("studentTerms");


            // Check empty fields

            if (
                !name ||
                !studentID ||
                !email ||
                department === "Select Department" ||
                year === "Select Year" ||
                !password ||
                !confirmPassword
            ) {

                alert("Please fill in all fields.");

                return;
            }


            // Check password

            if (!isValidPassword(password)) {

                alert(
                    "Password must contain:\n\n" +
                    "• At least 8 characters\n" +
                    "• One uppercase letter\n" +
                    "• One lowercase letter\n" +
                    "• One number\n" +
                    "• One special character"
                );

                return;
            }


            // Check confirm password

            if (password !== confirmPassword) {

                alert(
                    "Passwords do not match."
                );

                return;
            }


            // Check terms

            if (!terms.checked) {

                alert(
                    "Please agree to the Terms & Conditions."
                );

                return;
            }


            // Get existing users

            const users = getUsers();


            // Check duplicate email

            const emailExists =
                users.some(
                    user =>
                        user.email.toLowerCase() ===
                        email.toLowerCase()
                );


            if (emailExists) {

                alert(
                    "An account with this email already exists."
                );

                return;
            }


            // Check duplicate Student ID

            const studentIDExists =
                users.some(
                    user =>
                        user.studentID === studentID
                );


            if (studentIDExists) {

                alert(
                    "This Student ID is already registered."
                );

                return;
            }


            // Create student object

            const student = {

                id: Date.now(),

                name: name,

                studentID: studentID,

                email: email,

                department: department,

                year: year,

                password: password,

                role: "student"

            };


            // Add student

            users.push(student);

            saveUsers(users);


            alert(
                "Student account created successfully!"
            );


            // Go to login

            window.location.href =
                "login.html";

        }
    );
}


// ==========================================
// ADMIN REGISTRATION
// ==========================================

const adminRegisterForm =
    document.getElementById("adminRegisterForm");

if (adminRegisterForm) {

    adminRegisterForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            // Get admin details

            const name =
                document.getElementById("adminName").value.trim();

            const adminID =
                document.getElementById("adminID").value.trim();

            const email =
                document.getElementById("adminEmail").value.trim();

            const department =
                document.getElementById("adminDepartment").value;

            const password =
                document.getElementById("adminPassword").value;

            const confirmPassword =
                document.getElementById(
                    "adminConfirmPassword"
                ).value;

            const terms =
                document.getElementById("adminTerms");


            // Check empty fields

            if (
                !name ||
                !adminID ||
                !email ||
                department === "Select Department" ||
                !password ||
                !confirmPassword
            ) {

                alert("Please fill in all fields.");

                return;
            }


            // Password validation

            if (!isValidPassword(password)) {

                alert(
                    "Password must contain:\n\n" +
                    "• At least 8 characters\n" +
                    "• One uppercase letter\n" +
                    "• One lowercase letter\n" +
                    "• One number\n" +
                    "• One special character"
                );

                return;
            }


            // Confirm password

            if (password !== confirmPassword) {

                alert(
                    "Passwords do not match."
                );

                return;
            }


            // Terms

            if (!terms.checked) {

                alert(
                    "Please agree to the Terms & Conditions."
                );

                return;
            }


            // Get users

            const users = getUsers();


            // Check duplicate email

            const emailExists =
                users.some(
                    user =>
                        user.email.toLowerCase() ===
                        email.toLowerCase()
                );


            if (emailExists) {

                alert(
                    "An account with this email already exists."
                );

                return;
            }


            // Check duplicate Admin ID

            const adminIDExists =
                users.some(
                    user =>
                        user.adminID === adminID
                );


            if (adminIDExists) {

                alert(
                    "This Admin ID is already registered."
                );

                return;
            }


            // Create admin

            const admin = {

                id: Date.now(),

                name: name,

                adminID: adminID,

                email: email,

                department: department,

                password: password,

                role: "admin"

            };


            // Save admin

            users.push(admin);

            saveUsers(users);


            alert(
                "Admin account created successfully!"
            );


            // Go to login

            window.location.href =
                "login.html";

        }
    );
}


// ==========================================
// GET CURRENT USER
// ==========================================

function getCurrentUser() {

    const user =
        localStorage.getItem(
            "eduTrackCurrentUser"
        );

    return user
        ? JSON.parse(user)
        : null;
}


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    const confirmLogout =
        confirm(
            "Are you sure you want to logout?"
        );


    if (confirmLogout) {

        localStorage.removeItem(
            "eduTrackCurrentUser"
        );

        window.location.href =
            "../auth/login.html";
    }
}


// ==========================================
// CHECK LOGIN
// ==========================================

function checkLogin() {

    const currentUser =
        getCurrentUser();

    if (!currentUser) {

        window.location.href =
            "../auth/login.html";
    }
}


// ==========================================
// CHECK ROLE
// ==========================================

function checkRole(requiredRole) {

    const currentUser =
        getCurrentUser();


    if (!currentUser) {

        window.location.href =
            "../auth/login.html";

        return;
    }


    if (currentUser.role !== requiredRole) {

        alert(
            "You do not have permission to access this page."
        );


        if (currentUser.role === "student") {

            window.location.href =
                "../student/student-dashboard.html";

        } else {

            window.location.href =
                "../admin/admin-dashboard.html";
        }
    }
}

// ==========================================
// STUDENT LOGIN
// ==========================================

const studentLoginForm =
    document.getElementById("studentLoginForm");

if (studentLoginForm) {

    studentLoginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const email =
                document.getElementById("studentEmail")
                .value
                .trim();

            const password =
                document.getElementById("studentPassword")
                .value;


            // Get registered users

            const users = getUsers();


            // Find student

            const student =
                users.find(
                    user =>
                        user.email.toLowerCase() ===
                            email.toLowerCase()
                        &&
                        user.password === password
                        &&
                        user.role === "student"
                );


            // Login failed

            if (!student) {

                alert(
                    "Invalid student email or password."
                );

                return;
            }


            // Save logged-in user

            localStorage.setItem(
                "eduTrackCurrentUser",
                JSON.stringify(student)
            );


            alert(
                "Student login successful!"
            );


            // Go to student dashboard

            window.location.href =
                "../student/student-dashboard.html";

        }
    );
}



// ==========================================
// ADMIN LOGIN
// ==========================================

const adminLoginForm =
    document.getElementById("adminLoginForm");

if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const email =
                document.getElementById("adminEmail")
                .value
                .trim();

            const password =
                document.getElementById("adminPassword")
                .value;


            // Get registered users

            const users = getUsers();


            // Find admin

            const admin =
                users.find(
                    user =>
                        user.email.toLowerCase() ===
                            email.toLowerCase()
                        &&
                        user.password === password
                        &&
                        user.role === "admin"
                );


            // Login failed

            if (!admin) {

                alert(
                    "Invalid admin email or password."
                );

                return;
            }


            // Save logged-in user

            localStorage.setItem(
                "eduTrackCurrentUser",
                JSON.stringify(admin)
            );


            alert(
                "Admin login successful!"
            );


            // Go to admin dashboard

            window.location.href =
                "../admin/admin-dashboard.html";

        }
    );
}

// ==========================================
// FORGOT PASSWORD
// ==========================================

const forgotPasswordForm =
    document.getElementById("forgotPasswordForm");

if (forgotPasswordForm) {

    forgotPasswordForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const email =
                document.getElementById("forgotEmail")
                .value
                .trim();


            // Check empty email

            if (!email) {

                alert("Please enter your email address.");

                return;
            }


            // Get registered users

            const users = getUsers();


            // Find user

            const user =
                users.find(
                    user =>
                        user.email.toLowerCase() ===
                        email.toLowerCase()
                );


            // Email not registered

            if (!user) {

                alert(
                    "No account found with this email address."
                );

                return;
            }


            // Store email temporarily

            localStorage.setItem(
                "eduTrackResetEmail",
                email
            );


            alert(
                "Email verified. You can now reset your password."
            );


            // Go to reset password page

            window.location.href =
                "reset-password.html";

        }
    );
}

// ==========================================
// RESET PASSWORD
// ==========================================

const resetPasswordForm =
    document.getElementById("resetPasswordForm");

if (resetPasswordForm) {

    resetPasswordForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const newPassword =
                document.getElementById("newPassword").value;

            const confirmPassword =
                document.getElementById("confirmPassword").value;


            // Get reset email

            const resetEmail =
                localStorage.getItem("eduTrackResetEmail");


            // Check whether an email was verified

            if (!resetEmail) {

                alert(
                    "Password reset session expired. Please try again."
                );

                window.location.href =
                    "forgot-password.html";

                return;
            }


            // Validate password

            if (!isValidPassword(newPassword)) {

                alert(
                    "Password must contain:\n\n" +
                    "• At least 8 characters\n" +
                    "• One uppercase letter\n" +
                    "• One lowercase letter\n" +
                    "• One number\n" +
                    "• One special character"
                );

                return;
            }


            // Check passwords

            if (newPassword !== confirmPassword) {

                alert(
                    "Passwords do not match."
                );

                return;
            }


            // Get users

            const users = getUsers();


            // Find the account

            const userIndex =
                users.findIndex(
                    user =>
                        user.email.toLowerCase() ===
                        resetEmail.toLowerCase()
                );


            // Account not found

            if (userIndex === -1) {

                alert(
                    "Account not found."
                );

                return;
            }


            // Update password

            users[userIndex].password =
                newPassword;


            // Save updated users

            saveUsers(users);


            // Remove temporary reset email

            localStorage.removeItem(
                "eduTrackResetEmail"
            );


            // Success

            alert(
                "Password reset successfully!"
            );


            // Go back to login

            window.location.href =
                "login.html";

        }
    );
}