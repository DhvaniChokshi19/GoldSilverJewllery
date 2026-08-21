import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    collectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Collection", required: true, index: true },
    name:       { type: String, required: true, trim: true },
    label:      { type: String, required: true, trim: true },
    imageUrl:   { type: String, default: "" },
    isVisible:  { type: Boolean, default: true, index: true },
    order:      { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

categorySchema.index({ collectionId: 1, isVisible: 1, order: 1 });

const Category = mongoose.model("Category", categorySchema);
export default Category;