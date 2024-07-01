import { Schema, model } from "mongoose";
import Validator from "validator";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const { hash, compare } = bcryptjs;
const { isEmail } = Validator;
const { sign } = jwt;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Pleae enter name"],
    minLength: [4, "Name should be minimum 4 characters"],
    maxLength: [30, "Name shoukd not exceed 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    minLength: [8, "Password should be minimum of 8 character"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Encrypting password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await hash(this.password, 10);
});

// Generate JWT Token
userSchema.methods.getJWTToken = function () {
  return sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// match password
userSchema.methods.comparePassword = async function (enterPassword) {
  return await compare(enterPassword, this.password);
};

// Generate reset password token
userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = model("User", userSchema);

export default User;
