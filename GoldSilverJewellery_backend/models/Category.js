import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    collectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Collection", required: true },
    name:       { type: String, required: true, trim: true },
    label:      { type: String, required: true, trim: true },
    imageUrl:   { type: String, default: "" },
    isVisible:  { type: Boolean, default: true },
    order:      { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;