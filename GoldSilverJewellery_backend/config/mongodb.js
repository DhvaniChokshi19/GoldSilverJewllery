import mongoose from "mongoose";
import dns from "dns";

// Fix Node.js DNS SRV record lookup issues on Windows / ISP DNS resolvers
try {
  dns.setDefaultResultOrder("ipv4first");
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {
  console.warn("Could not set custom DNS servers:", err.message);
}

const connectDB = async () => {
  mongoose.connection.on("connected", () =>
    console.log("Database Connected successfully")
  );
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    await mongoose.connect(uri, {
      dbName: "goldsilverjewellery",
    });
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
  }
};
export default connectDB;

