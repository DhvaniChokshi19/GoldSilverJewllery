import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import authRouter from "./Routes/auth.js";
import Collection from "./Routes/CollectionRoutes.js";
import Category from "./Routes/CategoryRoutes.js";
import SubCategory from "./Routes/SubCategoryRoutes.js";
import Product from "./Routes/ProductRoutes.js";
import rateRouter from "./Routes/RateRoutes.js";
import connectCloudinary from "./config/cloudinary.js";

// Initialize app & connections
const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// Routers
app.use("/api", authRouter);
app.use("/api/collections", Collection);
app.use("/api/categories", Category);
app.use("/api/subcategories", SubCategory);
app.use("/api/products", Product);
app.use("/api/rates", rateRouter);

// Health check
app.get("/", (req, res) => {
  res.send("Gold Silver Jewellery API Operating Normally");
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(port, () => console.log(`Server started on port ${port}`));
