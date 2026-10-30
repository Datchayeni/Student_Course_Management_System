const validateCourse = (req, res, next) => {
    const {
        title,
        description,
        instructor,
        duration,
        price
    } = req.body;

    if (!title) {
        return res.status(400).json({
            success: false,
            message: "Course title is required"
        });
    }

    if (!description) {
        return res.status(400).json({
            success: false,
            message: "Course description is required"
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

    if (price === undefined || price === null || price === "") {
        return res.status(400).json({
            success: false,
            message: "Price is required"
        });
    }

    next();
};

module.exports = validateCourse;