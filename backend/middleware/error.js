import ErrorHandler from "../utils/errorHandler.js";

export default (err, req, res, next) => {
  console.log(err + "Error working");
  err.statusCode = err.statusCode || 400;
  err.message = err.message || "Internal Server Error";

  // Cast Error
  if (err.name === "CastError") {
    const message = `Resource not found , ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Mongo server duplicate key error
  if (err.code === 11000 || err.name === "MongoServerError") {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
