import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, sparse: true, trim: true },
    mobile: { type: String, unique: true, sparse: true, trim: true },
    password: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    name: { type: String, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    picture: { type: String },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;
