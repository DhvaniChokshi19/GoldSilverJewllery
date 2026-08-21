import express from "express";
import { uploadArrayImages } from "../middleware/upload.js";
import {
  getAllProducts,
  getAllProductsAdmin,
  getProductsByCategoryAdmin,
  getProductsByCategory,
  getProductById,
  createProduct,
  updateProduct,
  toggleProductVisibility,
  deleteProduct,
} from "../Controller/productController.js";

const productRouter = express.Router();

productRouter.get("/", getAllProducts);
productRouter.get("/admin/all", getAllProductsAdmin);
productRouter.get("/admin/by-category/:categoryId", getProductsByCategoryAdmin);
productRouter.get("/by-category/:categoryId", getProductsByCategory);
productRouter.get("/:id", getProductById);
productRouter.post("/", uploadArrayImages("images", 5), createProduct);
productRouter.put("/:id", uploadArrayImages("images", 5), updateProduct);
productRouter.patch("/:id/toggle-visibility", toggleProductVisibility);
productRouter.delete("/:id", deleteProduct);

export default productRouter;