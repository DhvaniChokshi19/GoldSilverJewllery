import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dns from "dns";

try {
  dns.setDefaultResultOrder("ipv4first");
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {
  // Ignore DNS set errors
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load dotenv manually so the path is resolved correctly
const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config({ path: join(__dirname, ".env") });

import mongoose from "mongoose";
import Collection from "./models/Collection.js";
import Category from "./models/Category.js";
import SubCategory from "./models/subCategory.js";
import Product from "./models/Product.js";

const clearAllData = async () => {
  console.log("Deleting all products...");
  const delProducts = await Product.deleteMany({});
  console.log(`Deleted ${delProducts.deletedCount} products.`);

  console.log("Deleting all subcategories...");
  const delSubCats = await SubCategory.deleteMany({});
  console.log(`Deleted ${delSubCats.deletedCount} subcategories.`);

  console.log("Deleting all categories...");
  const delCats = await Category.deleteMany({});
  console.log(`Deleted ${delCats.deletedCount} categories.`);

  console.log("Cleaning up collections (keeping only Gold and Silver)...");
  const delCols = await Collection.deleteMany({ name: { $nin: ["Gold", "Silver"] } });
  console.log(`Deleted ${delCols.deletedCount} other collections.`);

  // Ensure Gold and Silver exist
  const goldExists = await Collection.findOne({ name: "Gold" });
  if (!goldExists) {
    await Collection.create({ name: "Gold", isVisible: true });
    console.log("Re-created 'Gold' collection.");
  } else {
    console.log("'Gold' collection already exists.");
  }

  const silverExists = await Collection.findOne({ name: "Silver" });
  if (!silverExists) {
    await Collection.create({ name: "Silver", isVisible: true });
    console.log("Re-created 'Silver' collection.");
  } else {
    console.log("'Silver' collection already exists.");
  }

  console.log("Done! Only Gold and Silver collections remain.");
};

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI not found in .env file!");
  process.exit(1);
}

// Append database name if not present
const mongoUri = MONGODB_URI.includes("/goldsilverjewellery")
  ? MONGODB_URI
  : MONGODB_URI.replace(/\/?(\?|$)/, "/goldsilverjewellery$1");

console.log("Connecting to MongoDB Atlas...");

mongoose
  .connect(mongoUri, { serverSelectionTimeoutMS: 10000 })
  .then(async () => {
    console.log("Connected to MongoDB successfully.");
    await clearAllData();
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  });
