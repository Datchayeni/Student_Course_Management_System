// Student Log-in Validation

// Get the student login form
const studentLoginForm = document.querySelector("#studentLoginForm");

// Check if the form exists
if (studentLoginForm) {

    // Run this when the form is submitted
    studentLoginForm.addEventListener("submit", function (event) {

        // Prevent page refresh
        event.preventDefault();

        // Get the values entered by the user
        const email = document.querySelector("#studentEmail").value.trim();
        const password = document.querySelector("#studentPassword").value.trim();

        const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/;

        if (email === "" || password === "") {

            alert("Please enter both email and password.");
            return;
        }

        if (!email.includes("@")) {

            alert("Please enter a valid email.");
            return;
        }

        if (!passwordPattern.test(password)) {

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

        alert("Student Login Successful!");

        window.location.href = "../student/student-dashboard.html";

    });

}

// Admin Log-in Validation

const adminLoginForm = document.querySelector("#adminLoginForm");

if (adminLoginForm) {

    adminLoginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = document.querySelector("#adminEmail").value.trim();
        const password = document.querySelector("#adminPassword").value.trim();

        const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/;

        if (email === "" || password === "") {

            alert("Please enter admin email and password.");
            return;

        }

        if (!email.includes("@")) {

            alert("Please enter a valid admin email.");
            return;

        }


        if (!passwordPattern.test(password)) {

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

        alert("Admin Login Successful!");

        window.location.href = "../admin/admin-dashboard.html";

    });

}

// REGISTERATION

// ========================================
// Password Validation Pattern
// ========================================

const passwordPattern =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/;



// ========================================
// STUDENT REGISTRATION
// ========================================

const studentRegisterForm = document.querySelector("#studentRegisterForm");

if(studentRegisterForm){

studentRegisterForm.addEventListener("submit",function(event){

event.preventDefault();


// Get Values

const name=document.querySelector("#studentName").value.trim();

const id=document.querySelector("#studentID").value.trim();

const email=document.querySelector("#studentEmail").value.trim();

const department=document.querySelector("#studentDepartment").value;

const year=document.querySelector("#studentYear").value;

const password=document.querySelector("#studentPassword").value;

const confirmPassword=document.querySelector("#studentConfirmPassword").value;

const terms=document.querySelector("#studentTerms").checked;


// Validation

if(name==="" ||
id==="" ||
email==="" ||
department==="Select Department" ||
year==="Select Year" ||
password==="" ||
confirmPassword===""){

alert("Please fill all fields.");

return;

}


// Name Validation

if(name.length<3){

alert("Name must contain at least 3 characters.");

return;

}


// Student ID Validation

if(id.length<4){

alert("Enter a valid Student ID.");

return;

}


// Email Validation

if(!email.includes("@")){

alert("Enter a valid email address.");

return;

}


// Password Validation

if(!passwordPattern.test(password)){

alert(
"Password must contain:\n\n"+
"• Minimum 8 characters\n"+
"• One uppercase letter\n"+
"• One lowercase letter\n"+
"• One number\n"+
"• One special character"
);

return;

}


// Confirm Password

if(password!==confirmPassword){

alert("Passwords do not match.");

return;

}


// Terms

if(!terms){

alert("Please accept Terms & Conditions.");

return;

}


// Success

alert("Student Registration Successful!");

window.location.href="login.html";


});

}



// ========================================
// ADMIN REGISTRATION
// ========================================

const adminRegisterForm=document.querySelector("#adminRegisterForm");

if(adminRegisterForm){

adminRegisterForm.addEventListener("submit",function(event){

event.preventDefault();


// Get Values

const name=document.querySelector("#adminName").value.trim();

const id=document.querySelector("#adminID").value.trim();

const email=document.querySelector("#adminEmail").value.trim();

const department=document.querySelector("#adminDepartment").value;

const password=document.querySelector("#adminPassword").value;

const confirmPassword=document.querySelector("#adminConfirmPassword").value;

const terms=document.querySelector("#adminTerms").checked;


// Validation

if(name==="" ||
id==="" ||
email==="" ||
department==="Select Department" ||
password==="" ||
confirmPassword===""){

alert("Please fill all fields.");

return;

}


// Name

if(name.length<3){

alert("Admin name must contain at least 3 characters.");

return;

}


// Admin ID

if(id.length<3){

alert("Enter a valid Admin ID.");

return;

}


// Email

if(!email.includes("@")){

alert("Enter a valid email address.");

return;

}


// Password

if(!passwordPattern.test(password)){

alert(
"Password must contain:\n\n"+
"• Minimum 8 characters\n"+
"• One uppercase letter\n"+
"• One lowercase letter\n"+
"• One number\n"+
"• One special character"
);

return;

}


// Confirm Password

if(password!==confirmPassword){

alert("Passwords do not match.");

return;

}


// Terms

if(!terms){

alert("Please accept Terms & Conditions.");

return;

}


// Success

alert("Admin Registration Successful!");

window.location.href="login.html";


});

}

// Forgot Password

const forgotPasswordForm = document.querySelector("#forgotPasswordForm");

if (forgotPasswordForm) {

    forgotPasswordForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const email = document.querySelector("#forgotEmail").value.trim();

        if (email === "") {

            alert("Please enter your registered email.");

            return;

        }

        alert("Reset link sent successfully.");

        window.location.href = "reset-password.html";

    });

}