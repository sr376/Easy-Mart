import { Router } from "express";
import { isAuthenticated, isAuthorized } from "../middleware/auth.js";
import {
  deleteOrder,
  getAllOrders,
  getSingleOrder,
  myOrder,
  newOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = Router();

router.route("/order/new").post(isAuthenticated, newOrder);

router.route("/order/me").get(isAuthenticated, myOrder);

// Admin Routes
router
  .route("/admin/orders")
  .get(isAuthenticated, isAuthorized("admin"), getAllOrders);
router
  .route("/admin/order/detail/:id")
  .get(isAuthenticated, isAuthorized("admin"), getSingleOrder);
router
  .route("/admin/order/update/:id")
  .put(isAuthenticated, isAuthorized("admin"), updateOrderStatus);
router
  .route("/admin/order/delete/:id")
  .delete(isAuthenticated, isAuthorized("admin"), deleteOrder);

export default router;
