const Course = require("../models/Course");

// Only these fields can be written by clients (prevents mass assignment)
const pickCourseFields = (body) => ({
    title: body.title,
    description: body.description,
    instructor: body.instructor,
    duration: body.duration,
    price: body.price
});

// GET /api/v1/courses
const getCourses = async (req, res, next) => {
    try {
        // page/limit are validated by paginationValidation; the caps here are a second line of defence.
        // Default limit is 50 (max 100) so the existing frontend keeps receiving the full course list.
        const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
        const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 50));

        const [courses, total] = await Promise.all([
            Course.find({})
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Course.countDocuments({})
        ]);

        res.status(200).json({
            success: true,
            count: courses.length,
            total,
            page,
            pages: Math.max(1, Math.ceil(total / limit)),
            data: courses
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/v1/courses/:id
const getCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id).lean();

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/v1/courses
const addCourse = async (req, res, next) => {
    try {
        const newCourse = await Course.create(pickCourseFields(req.body));

        res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: newCourse
        });
    } catch (error) {
        next(error);
    }
};

// PUT /api/v1/courses/:id
const editCourse = async (req, res, next) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            pickCourseFields(req.body),
            { new: true, runValidators: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse
        });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/v1/courses/:id
const removeCourse = async (req, res, next) => {
    try {
        const deleted = await Course.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCourses,
    getCourse,
    addCourse,
    editCourse,
    removeCourse
};