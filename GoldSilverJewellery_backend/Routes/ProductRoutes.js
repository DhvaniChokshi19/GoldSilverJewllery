import express3  from "express";
import multer2   from "multer";
import {
  getAllProductsAdmin, getProductsByCategoryAdmin, getProductsByCategory,
  getProductById, createProduct, updateProduct,
  toggleProductVisibility, deleteProduct,
} from "../Controller/productController.js";
 
const productRouter = express3.Router();
 
const prodUpload = multer2({
  storage: multer2.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    file.mimetype.startsWith("image/") ? cb(null, true) : cb(new Error("Images only"));
  },
});
 
productRouter.get("/admin/all",                       getAllProductsAdmin);
productRouter.get("/admin/by-category/:categoryId",   getProductsByCategoryAdmin);
productRouter.get("/by-category/:categoryId",         getProductsByCategory);
productRouter.get("/:id",                             getProductById);
productRouter.post("/",    prodUpload.array("images", 5), createProduct);   // up to 5
productRouter.put("/:id",  prodUpload.array("images", 5), updateProduct);
productRouter.patch("/:id/toggle-visibility",         toggleProductVisibility);
productRouter.delete("/:id",                          deleteProduct);
 
export default productRouter;