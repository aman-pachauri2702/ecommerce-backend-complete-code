class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorMiddleware = (err, req, res, next) => {

  // 🔴 CRITICAL FIX
  if (res.headersSent) {
    return next(err);
  }

  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // MongoDB duplicate key error
  if (err.code === 11000) {
    err = new ErrorHandler("Duplicate field value entered", 400);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("JSON Web Token is invalid, try again", 401);
  }

  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("JSON Web Token has expired, try again", 401);
  }

  // MongoDB cast error
  if (err.name === "CastError") {
    err = new ErrorHandler(`Invalid ${err.path}: ${err.value}`, 400);
  }

  const errorMessage = err.errors
    ? Object.values(err.errors).map(e => e.message).join(" ")
    : err.message;

  res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorHandler;
