import catchAsyncError from "../middleware/catchAsyncError.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import ErrorHandler from "../utils/errorHandler.js";

// New Order
export const newOrder = catchAsyncError(async (req, res, next) => {
  const {
    orderInfo,
    shippingInfo,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  const order = await Order.create({
    orderInfo,
    shippingInfo,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    message: "Order has been placed successfully",
    order,
  });
});

// Get my order
export const myOrder = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// Get All Orders --Admin
export const getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// Get Single Product --Admin
export const getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Update order status --Admin
export const updateOrderStatus = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 404));
    }
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("Order has been delivered already", 404));
  }

  order.orderInfo.forEach(async (odr) => {
    await updateStock(odr.product, odr.quantity);
  });

  const { status } = req.body;
  order.orderStatus = status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Order Status has been updated successfully",
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product.stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

// Delete Order --Admin
export const deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 404));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
    message: "Order has been deleted successfully",
  });
});
