class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again!`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, Try again!`;
    err = new ErrorHandler(message, 400);
  }
  
  // Handle multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File size should be less than 5MB!';
    err = new ErrorHandler(message, 400);
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Unexpected file field!';
    err = new ErrorHandler(message, 400);
  }
  if (err.message === 'Only PDF files are allowed!') {
    err = new ErrorHandler(err.message, 400);
  }
  
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler; 