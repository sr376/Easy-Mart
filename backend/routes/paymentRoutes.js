import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { processPayment, sendStripeApiKey } from "../controllers/paymentController.js";

const router = Router();

router.route("/payment/process").post(processPayment);
router.route("/stripeapikey").get(isAuthenticated,sendStripeApiKey)

export default router;


//11:14:31