import mongoose from "mongoose";

const rateSchema = new mongoose.Schema({
  gold24k: { type: Number, required: true, default: 7450 }, // rate per gram in INR
  gold22k: { type: Number, required: true, default: 6830 },
  gold18k: { type: Number, required: true, default: 5590 },
  gold14k: { type: Number, required: true, default: 4350 },
  silver999: { type: Number, required: true, default: 89 }, // rate per gram in INR
  silver925: { type: Number, required: true, default: 82 },
  gold24kChange: { type: Number, default: 0.45 }, // percentage change
  silver999Change: { type: Number, default: -0.12 },
  currency: { type: String, default: "INR" },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: String, default: "System / Admin" }
});

const Rate = mongoose.models.Rate || mongoose.model("Rate", rateSchema);

export default Rate;
