import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    collectionId:  { type: mongoose.Schema.Types.ObjectId, ref: "Collection", required: true },
    categoryId:    { type: mongoose.Schema.Types.ObjectId, ref: "Category",   required: true },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      default: null,
    },
    name:        { type: String, required: true, trim: true },
    label:       { type: String, trim: true, default: "" },
    productCode: { type: String, trim: true, default: "" },   // SKU
    weight:      { type: String, trim: true, default: "" },   // e.g. "8.5g"
    price:       { type: String, required: true },             // String so admin can write "₹45,000"
    images:      [{ type: String }],                           // up to 5 Cloudinary URLs
    isVisible:   { type: Boolean, default: true },
    isFeatured:  { type: Boolean, default: false },
    isBestseller:{ type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
