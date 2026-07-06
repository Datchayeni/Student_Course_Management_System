# Student Course Management and Learning Progress Tracking System

## Project Overview

The Student Course Management and Learning Progress Tracking System is a full-stack web application developed to simplify academic course enrollment, learning management, and student progress tracking. The system enables students to register, browse available courses, enroll in courses, access learning materials, monitor their learning progress, and receive real-time notifications.

The application also provides administrators with tools to manage students, courses, enrollments, learning content, and generate reports. This project demonstrates modern full-stack web development concepts, including frontend development, backend APIs, authentication, database management, real-time communication, and deployment.

---

# Features

## Student

* Register and log in securely
* View and update profile
* Browse available courses
* Search for courses
* Enroll in courses
* Access course materials
* Track learning progress
* View course completion percentage
* Receive notifications
* Continue learning from previous progress

## Administrator

* Secure administrator login
* Add new courses
* Edit existing courses
* Delete courses
* Manage student records
* Monitor course enrollments
* Update course content
* Generate reports
* View analytics through the dashboard

---

# System Modules

## Module 1: User Authentication

### Features

* Student Registration
* Student Login
* Password Encryption using bcrypt
* Forgot Password
* JWT Authentication

---

## Module 2: Course Management

### Features

* Add Course
* Update Course
* Delete Course
* View Course Details

### Course Information

| Field       | Description                            |
| ----------- | -------------------------------------- |
| Course ID   | Unique course identifier               |
| Course Name | Course title                           |
| Instructor  | Faculty name                           |
| Duration    | Number of weeks                        |
| Description | Course information                     |
| Category    | Programming, AI, Web Development, etc. |

---

## Module 3: Course Enrollment

### Features

* Browse Courses
* Search Courses
* Enroll in Courses
* View Enrolled Courses

### Workflow

Student Login → Browse Courses → Select Course → Enroll → Confirmation

---

## Module 4: Learning Management

### Features

* View Course Modules
* Access Learning Materials
* Mark Modules as Completed
* Continue Learning

### Sample Course Modules

* HTML
* CSS
* JavaScript
* React
* Node.js
* MongoDB

---

## Module 5: Progress Tracking

### Features

* Completion Percentage
* Course Progress Bar
* Completed Modules
* Pending Modules

### Sample Progress

| Course | Progress |
| ------ | -------- |
| Python | 80%      |
| React  | 60%      |
| DBMS   | 100%     |

---

## Module 6: Dashboard

### Student Dashboard

Displays:

* Total Courses Enrolled
* Courses Completed
* Ongoing Courses
* Progress Statistics

### Administrator Dashboard

Displays:

* Total Students
* Total Courses
* Active Enrollments
* Completion Reports

---

## Module 7: Notifications

### Features

* New Course Alerts
* Enrollment Confirmation
* Assignment Reminders
* Completion Certificates

### Technologies Used

* WebSockets
* Socket.IO

---

# Problem Statement

Many educational institutions face challenges in managing course registration and monitoring student progress through separate or manual systems.

Students often experience difficulties in:

* Finding available courses
* Registering for courses efficiently
* Tracking learning progress
* Accessing learning materials
* Monitoring completed and pending modules

Administrators face challenges in:

* Managing course enrollments
* Updating course content
* Monitoring student performance
* Generating reports

This system addresses these issues by providing a centralized web-based platform.

---

# Project Objectives

* Provide secure student registration and login.
* Allow students to browse and enroll in courses.
* Enable administrators to create and manage courses.
* Track student learning progress.
* Generate progress reports.
* Send real-time notifications and updates.
* Maintain secure access to academic data.

---

# Technology Stack

| Layer                   | Technology                                   |
| ----------------------- | -------------------------------------------- |
| Frontend                | HTML5, CSS3, Bootstrap, JavaScript, React.js |
| Backend                 | Node.js, Express.js                          |
| Database                | MongoDB                                      |
| Authentication          | JWT, bcrypt                                  |
| Real-time Communication | Socket.IO                                    |
| API Testing             | Postman                                      |
| Version Control         | Git, GitHub                                  |
| Deployment              | Render, Vercel, Railway                      |

---

# Database Design

## Students Collection

| Field      | Type             |
| ---------- | ---------------- |
| student_id | Integer          |
| name       | String           |
| email      | String           |
| password   | Encrypted String |
| department | String           |

### Courses Collection

| Field       | Type    |
| ----------- | ------- |
| course_id   | Integer |
| course_name | String  |
| instructor  | String  |
| duration    | String  |
| description | String  |
| category    | String  |

### Enrollments Collection

| Field           | Type    |
| --------------- | ------- |
| enrollment_id   | Integer |
| student_id      | Integer |
| course_id       | Integer |
| enrollment_date | Date    |

### Progress Collection

| Field               | Type    |
| ------------------- | ------- |
| progress_id         | Integer |
| student_id          | Integer |
| course_id           | Integer |
| completed_modules   | Number  |
| progress_percentage | Number  |

---

# API Endpoints

## Authentication

* POST /api/auth/register
* POST /api/auth/login
* POST /api/auth/forgot-password

## Courses

* GET /api/courses
* GET /api/courses/:id
* POST /api/courses
* PUT /api/courses/:id
* DELETE /api/courses/:id

## Enrollment

* POST /api/enroll
* GET /api/enrollments

## Progress

* GET /api/progress
* PUT /api/progress/:id

---

# Future Enhancements

* Online Quiz System
* Assignment Submission
* Discussion Forum
* Video Lectures
* AI-Based Course Recommendations
* Email Notifications
* Certificate Generation
* Mobile Application
* Payment Gateway Integration
* Attendance Tracking

---

# Screenshots

The following screenshots can be added after completing the project:

* Home Page
* Login Page
* Student Dashboard
* Administrator Dashboard
* Course Management Page
* Enrollment Page
* Progress Tracking Page
* Notifications Page
