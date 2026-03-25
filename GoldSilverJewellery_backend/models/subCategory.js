import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name:      { type: String, required: true, trim: true },
    label:     { type: String, trim: true, default: "" },
    imageUrl:  { type: String, default: "" },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const SubCategory = mongoose.model("SubCategory", subCategorySchema);
export default SubCategory;