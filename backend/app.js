import express, { json } from "express";
import bodyParser from "body-parser";
const { urlencoded } = bodyParser;
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/error.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js"
import cors from "cors";

const app = express();

app.use(json());
app.use(cors());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

// All routes
app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);


// Error handler middleware
app.use(errorMiddleware);

export default app;
