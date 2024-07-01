import jwt from "jsonwebtoken";
import catchAsyncError from "./catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import User from "../models/userModel.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  
  const {token}  = req.cookies; 
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);
  next();
});

// To check user is admin or not
export function isAuthorized(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler("Not authorized to access this resource", 404)
      );
    }
    next();
  };
}
