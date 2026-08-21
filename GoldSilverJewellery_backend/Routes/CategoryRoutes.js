import express from "express";
import { uploadSingleImage } from "../middleware/upload.js";
import {
  getCategoriesByCollectionAdmin,
  getCategoriesByCollection,
  createCategory,
  updateCategory,
  toggleCategoryVisibility,
  deleteCategory,
} from "../Controller/categoryController.js";

const categoryRouter = express.Router();

categoryRouter.get("/by-collection/:collectionId", getCategoriesByCollection);
categoryRouter.get("/admin/by-collection/:collectionId", getCategoriesByCollectionAdmin);
categoryRouter.post("/", uploadSingleImage("image"), createCategory);
categoryRouter.put("/:id", uploadSingleImage("image"), updateCategory);
categoryRouter.patch("/:id/toggle-visibility", toggleCategoryVisibility);
categoryRouter.delete("/:id", deleteCategory);

export default categoryRouter;