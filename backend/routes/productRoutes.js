import { Router } from "express";
import {
  createProduct,
  getProductDetail,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getAllReview,
  createProductReview,
} from "../controllers/productController.js";
import { isAuthenticated, isAuthorized } from "../middleware/auth.js";

const router = Router();

router.route("/product/details/:id").get( isAuthenticated,getProductDetail);//isAuthenticated,
router.route("/allProducts").get(getAllProducts); // Add Authentication
router.route("/allReviews").get(isAuthenticated, getAllReview)
router.route("/product/review").put(isAuthenticated, createProductReview)

// Admin
router
  .route("/product/new")
  .post(isAuthenticated, isAuthorized("admin"), createProduct);
router
  .route("/product/update/:id")
  .put(isAuthenticated, isAuthorized("admin"), updateProduct);
router
  .route("/product/delete/:id")
  .delete(isAuthenticated, isAuthorized("admin"), deleteProduct);

export default router;
