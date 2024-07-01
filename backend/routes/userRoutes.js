import { Router } from "express";
import {
  loginUser,
  logoutUser,
  getAllUsers,
  getUserDetail,
  updateUserRole,
  deleteUser,
  getPersonalDetail,
  updatePassword,
  updateProfile,
  forgotPassword,
  resetPassword,
  registerUser,
} from "../controllers/userController.js";
import { isAuthenticated, isAuthorized } from "../middleware/auth.js";
const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").patch(resetPassword);

// User Routes (LoggedIn)
router.route("/me").get(isAuthenticated, getPersonalDetail);
router.route("/update/password").put(isAuthenticated,updatePassword); 
router.route("/update/profile").put(isAuthenticated, updateProfile);

// Admin Routes
router
  .route("/allUsers")
  .get(isAuthenticated, isAuthorized("admin"), getAllUsers);
router
  .route("/user/detail/:id")
  .get(isAuthenticated, isAuthorized("admin"), getUserDetail);
router
  .route("/user/role/:id")
  .put(isAuthenticated, isAuthorized("admin"), updateUserRole);
router
  .route("/user/delete/:id")
  .delete(isAuthenticated, isAuthorized("admin"), deleteUser);

export default router;

// check all api /me and after /me
