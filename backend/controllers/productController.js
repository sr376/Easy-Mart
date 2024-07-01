import catchAsyncError from "../middleware/catchAsyncError.js";
import Product from "../models/productModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import ApiFeatures from "../utils/apiFeatures.js";

export function gethello(req, res) {
  res.status(200).json({
    message: "working",
  });
}

export const createProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    product,
    message: "Product created successfully",
  });
});

export const getAllProducts = catchAsyncError(async (req, res, next) => {
  const resultPerpage = 8;
  const productsCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();
  let products = await apiFeature.query;
  let filteredProductsCount = products.length;
  apiFeature.pagination(resultPerpage);

  products = await apiFeature.query.clone();

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerpage,
    filteredProductsCount,
  });
});

export const getProductDetail = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

export const updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

export const deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product has been deleted successfully",
  });
});

//Get All Review
export const getAllReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product is not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Create new review or update review
export const createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  if(!product) {
    return next(new ErrorHandler("Product not found",404))
  }

  const isReviewed = product.reviews.forEach((rev) => {
    rev.user.toString() === req.user._id.toString();
  });

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.ratings = product.reviews.forEach((review) => {
    avg += review.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});
