import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    name:      { type: String, required: true, trim: true },
    label:     { type: String, trim: true, default: "" },
    imageUrl:  { type: String, default: "" },
    isVisible: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

subCategorySchema.index({ categoryId: 1, isVisible: 1 });
subCategorySchema.index({ collectionId: 1, categoryId: 1 });

const SubCategory = mongoose.model("SubCategory", subCategorySchema);
export default SubCategory;