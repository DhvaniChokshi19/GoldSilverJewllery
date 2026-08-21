import mongoose from "mongoose";
import dns from "dns";
import "dotenv/config";

try {
  dns.setDefaultResultOrder("ipv4first");
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {
  // Ignore DNS set errors
}
import Collection from "./models/Collection.js";
import Category from "./models/Category.js";
import SubCategory from "./models/subCategory.js";

/**
 * Ensures the Gold and Silver collections exist.
 * No categories or products are seeded by default.
 */
export const seedProductListItems = async () => {
  console.log("Ensuring Gold and Silver collections exist...");

  let goldCol = await Collection.findOne({ name: "Gold" });
  if (!goldCol) {
    goldCol = await Collection.create({ name: "Gold", isVisible: true });
    console.log("Created 'Gold' collection");
  }

  let silverCol = await Collection.findOne({ name: "Silver" });
  if (!silverCol) {
    silverCol = await Collection.create({ name: "Silver", isVisible: true });
    console.log("Created 'Silver' collection");
  }

  console.log("Done. Add categories and products from the admin panel.");
  return {
    success: true,
    message: "Collections ensured. No categories or products seeded.",
  };
};
