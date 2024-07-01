import { Schema, model } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
  },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },
  price: {
    type: Number,
    required: [true, "Please enter product price"],
    maxLength: 5,
  },
  images: [
    {
      product_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],

  stock: {
    type: Number,
    required: [true, "Please enter product stocks"],
    maxLength: [4, "Product stock cannot exceed 4 character"],
    default: 1,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: [true, "Please enter product category"],
  },
  reviews: [
    {
      user: {
        type: Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
      },
    },
  ],
  ratings: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default new model("Product", productSchema);
