import RateRepository from "../repositories/RateRepository.js";
import asyncHandler from "../middleware/asyncHandler.js";

// Get latest rates
export const getRates = asyncHandler(async (req, res) => {
  let rate = await RateRepository.getLatestRate();

  // If no rates exist yet, seed initial rates
  if (!rate) {
    rate = await RateRepository.create({
      gold24k: 7450,
      gold22k: 6830,
      gold18k: 5590,
      gold14k: 4350,
      silver999: 89,
      silver925: 82,
      gold24kChange: 0.45,
      silver999Change: -0.12,
      currency: "INR",
      updatedBy: "System Initializer",
    });
  }

  res.status(200).json({
    success: true,
    data: rate,
  });
});

// Update rates (Admin)
export const updateRates = asyncHandler(async (req, res) => {
  const {
    gold24k,
    gold22k,
    gold18k,
    gold14k,
    silver999,
    silver925,
    gold24kChange,
    silver999Change,
    updatedBy,
  } = req.body;

  let rate = await RateRepository.getLatestRate();

  if (rate) {
    rate.gold24k = gold24k !== undefined ? gold24k : rate.gold24k;
    rate.gold22k = gold22k !== undefined ? gold22k : rate.gold22k;
    rate.gold18k = gold18k !== undefined ? gold18k : rate.gold18k;
    rate.gold14k = gold14k !== undefined ? gold14k : rate.gold14k;
    rate.silver999 = silver999 !== undefined ? silver999 : rate.silver999;
    rate.silver925 = silver925 !== undefined ? silver925 : rate.silver925;
    rate.gold24kChange = gold24kChange !== undefined ? gold24kChange : rate.gold24kChange;
    rate.silver999Change = silver999Change !== undefined ? silver999Change : rate.silver999Change;
    rate.updatedAt = Date.now();
    rate.updatedBy = updatedBy || "Admin";

    await rate.save();
  } else {
    rate = await RateRepository.create({
      gold24k,
      gold22k,
      gold18k,
      gold14k,
      silver999,
      silver925,
      gold24kChange: gold24kChange || 0,
      silver999Change: silver999Change || 0,
      updatedBy: updatedBy || "Admin",
    });
  }

  res.status(200).json({
    success: true,
    message: "Bullion rates updated successfully",
    data: rate,
  });
});
