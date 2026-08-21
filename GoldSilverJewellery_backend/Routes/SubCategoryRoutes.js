import express from "express";
import { uploadSingleImage } from "../middleware/upload.js";
import {
  getSubCategoriesByCategoryAdmin,
  getSubCategoriesByCategory,
  createSubCategory,
  updateSubCategory,
  toggleSubCategoryVisibility,
  deleteSubCategory,
} from "../Controller/SubCategoryController.js";

const router = express.Router();

// Public
router.get("/by-category/:categoryId", getSubCategoriesByCategory);

// Admin
router.get("/admin/by-category/:categoryId", getSubCategoriesByCategoryAdmin);
router.post("/", uploadSingleImage("image"), createSubCategory);
router.put("/:id", uploadSingleImage("image"), updateSubCategory);
router.patch("/:id/toggle-visibility", toggleSubCategoryVisibility);
router.delete("/:id", deleteSubCategory);

export default router;