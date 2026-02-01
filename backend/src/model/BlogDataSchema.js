import mongoose from "mongoose";

const BlogDataSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },

    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
    },
    image: {
      type: String,
    },
    // The API returns rating as an object { rate: 3.9, count: 120 }
    rating: {
      rate: { type: Number },
      count: { type: Number }
    },

    SEO: {
      type: [String],
    },
    blog_post: {
      type: String,
    },
    blog_title: {
      type: String,
    },


  },
  { timestamps: true }
);

const product = mongoose.model("Product", BlogDataSchema);

export default product;