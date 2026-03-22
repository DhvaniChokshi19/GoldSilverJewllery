import mongoose from "mongoose";
if (mongoose.models.User) {
  delete mongoose.models.User;
}
const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true},
    mobile: { type: String, unique: true},
    password: { type: String },
    googleId: { type: String,unique: true, sparse: true},
    name: {type: String},
    email: {type: String, unique: true, sparse: true},
    picture: {type: String},
    authProvider: {type: String, enum: ["local","google"], default: "local"},
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model("User", userSchema);
export default userModel;
