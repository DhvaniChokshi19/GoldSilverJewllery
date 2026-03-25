import express from "express";
import multer  from "multer";
import {
  getSubCategoriesByCategoryAdmin,
  getSubCategoriesByCategory,
  createSubCategory,
  updateSubCategory,
  toggleSubCategoryVisibility,
  deleteSubCategory,
} from "../Controller/SubCategoryController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    file.mimetype.startsWith("image/") ? cb(null, true) : cb(new Error("Images only"));
  },
});

// Public
router.get("/by-category/:categoryId",        getSubCategoriesByCategory);
// Admin
router.get("/admin/by-category/:categoryId",  getSubCategoriesByCategoryAdmin);
router.post("/",    upload.single("image"),    createSubCategory);
router.put("/:id",  upload.single("image"),    updateSubCategory);
router.patch("/:id/toggle-visibility",         toggleSubCategoryVisibility);
router.delete("/:id",                          deleteSubCategory);

export default router;