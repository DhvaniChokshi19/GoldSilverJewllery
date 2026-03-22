import express2  from "express";
import multer    from "multer";
import {
  getCategoriesByCollectionAdmin, getCategoriesByCollection,
  createCategory, updateCategory,
  toggleCategoryVisibility, deleteCategory,
} from "../Controller/categoryController.js";
 
const categoryRouter = express2.Router();
 
const catUpload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    file.mimetype.startsWith("image/") ? cb(null, true) : cb(new Error("Images only"));
  },
});
 
categoryRouter.get("/by-collection/:collectionId",        getCategoriesByCollection);
categoryRouter.get("/admin/by-collection/:collectionId",  getCategoriesByCollectionAdmin);
categoryRouter.post("/",      catUpload.single("image"),   createCategory);
categoryRouter.put("/:id",    catUpload.single("image"),   updateCategory);
categoryRouter.patch("/:id/toggle-visibility",            toggleCategoryVisibility);
categoryRouter.delete("/:id",                             deleteCategory);
 
export default categoryRouter;
 