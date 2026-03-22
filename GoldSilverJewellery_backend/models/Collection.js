import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true, trim: true },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Collection = mongoose.model("Collection", collectionSchema);
export default Collection;