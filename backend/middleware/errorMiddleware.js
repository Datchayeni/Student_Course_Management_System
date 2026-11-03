function errorHandler(err, req, res, next) {
  // Expected client errors (400/401/409...) don't need a stack trace in the console
  const knownStatus = err.status || err.statusCode;
  if (!(Number.isInteger(knownStatus) && knownStatus < 500)) {
    console.error(err);
  }

  if (err.code === 11000) {
    return res.status(409).json({
      message: "Duplicate value already exists"
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(err.errors).map(
        (item) => item.message
      )
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid identifier"
    });
  }

  // Support both err.status and err.statusCode
  const errStatus = err.status || err.statusCode;

  const status =
    Number.isInteger(errStatus) &&
    errStatus >= 400 &&
    errStatus < 600
      ? errStatus
      : 500;

  res.status(status).json({
    message:
      status === 500
        ? "Internal server error"
        : err.message
  });
}

module.exports = errorHandler;