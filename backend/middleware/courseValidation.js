const validateCourse = (req, res, next) => {

    const {
        courseName,
        courseCode,
        instructor,
        duration,
        category
    } = req.body;

    if (!courseName) {

        return res.status(400).json({
            success: false,
            message: "Course name is required"
        });
    }

    if (!courseCode) {

        return res.status(400).json({
            success: false,
            message: "Course code is required"
        });
    }

    if (!instructor) {

        return res.status(400).json({
            success: false,
            message: "Instructor is required"
        });
    }

    if (!duration) {

        return res.status(400).json({
            success: false,
            message: "Duration is required"
        });
    }

    if (!category) {

        return res.status(400).json({
            success: false,
            message: "Category is required"
        });
    }

    next();
};

module.exports = validateCourse;
