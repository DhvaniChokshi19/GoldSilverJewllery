import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    collectionId:  { type: mongoose.Schema.Types.ObjectId, ref: "Collection", required: true, index: true },
    categoryId:    { type: mongoose.Schema.Types.ObjectId, ref: "Category",   required: true, index: true },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      default: null,
      index: true
    },
    name:        { type: String, required: true, trim: true },
    label:       { type: String, trim: true, default: "" },
    productCode: { type: String, trim: true, default: "" },   // SKU
    weight:      { type: String, trim: true, default: "" },   // e.g. "8.5g"
    price:       { type: String, required: true },             // String so admin can write "₹45,000"
    images:      [{ type: String }],                           // up to 5 Cloudinary URLs
    isVisible:   { type: Boolean, default: true, index: true },
    isFeatured:  { type: Boolean, default: false, index: true },
    isBestseller:{ type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// Compound indexes for fast query execution
productSchema.index({ categoryId: 1, isVisible: 1 });
productSchema.index({ collectionId: 1, isVisible: 1 });
productSchema.index({ subCategoryId: 1, isVisible: 1 });
productSchema.index({ isFeatured: 1, isVisible: 1 });

const Product = mongoose.model("Product", productSchema);
export default Product;
