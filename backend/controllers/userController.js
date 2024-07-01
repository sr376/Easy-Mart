import catchAsyncError from "../middleware/catchAsyncError.js";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/jwtToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

//Register
export const registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password} = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar:{
      public_id: "kdflskd",
      url: "djdsjk"
    },
  });

  sendToken(user, 200, res);
});

// Login
export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Invalid credentials", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid credentials", 400));
  }

  const passwordMatched = await user.comparePassword(password);

  if (!passwordMatched) {
    return next(new ErrorHandler("Invalid credentials", 400));
  }

  await sendToken(user, 200, res);
});


// Logout User
export const logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});


// getPersonal Detail
export const getPersonalDetail = catchAsyncError(async (req, res, next) => {

  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler("not working"));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// Update Password
export const updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  console.log(user);
  const isPasswordCorrect = await user.comparePassword(req.body.password);

  if (!isPasswordCorrect) {
    return next(new ErrorHandler("old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.newPassword;

  user.save();

  sendToken(user, 200, res);
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  let user = await User.findById(req.user.id);
  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.user.id} `, 404)
    );
  }

  user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.user.id} `, 404)
    );
  }

  res.status(200).json({
    success: true,
    message: "Successfully updated",
  });
});

export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

export const getUserDetail = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

export const updateUserRole = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id} `, 404)
    );
  }

  res.status(200).json({
    success: true,
    message: "User role updated successfully",
    user,
  });
});

export const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id} `, 404)
    );
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User Deleted successfully",
  });
});

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  // find email
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler(`Email: ${email} is not found`, 404));
  }

  //generate randome token
  const resetToken = user.generateResetPasswordToken();
  await user.save();

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken} `;
  const message = `We have received a password reset request . Please use the below link to reset your password\n\n ${resetUrl}\n\nThis link will be valid for 10 min only.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Reset Password`,
      message: message,
    });

    res.status(200).json({
      success: true,
      message: "Email has been send successfully",
    });
  } catch (error) {
    (user.resetPasswordToken = undefined),
      (user.resetPasswordExpire = undefined);
    user.save();

    return next(
      new ErrorHandler(
        `Their was an error while sending reset password email. Please try again later`,
        500
      )
    );
  }
});

// Reset Password
export const resetPassword = catchAsyncError(async (req, res, next) => {
  // convert token 
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Token is invalid or expired", 404));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});
