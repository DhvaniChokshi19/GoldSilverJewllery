import SubCategoryRepository from "../repositories/SubCategoryRepository.js";
import ProductRepository from "../repositories/ProductRepository.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryHelper.js";
import asyncHandler from "../middleware/asyncHandler.js";

// GET all for a category — admin (uses aggregated counts)
export const getSubCategoriesByCategoryAdmin = asyncHandler(async (req, res) => {
  const data = await SubCategoryRepository.getSubCategoriesWithCounts({
    categoryId: req.params.categoryId,
  });
  res.json({ success: true, data });
});

// GET visible for a category — storefront
export const getSubCategoriesByCategory = asyncHandler(async (req, res) => {
  const data = await SubCategoryRepository.find(
    { categoryId: req.params.categoryId, isVisible: true },
    null,
    { sort: { order: 1 } }
  );
  res.json({ success: true, data });
});

// CREATE
export const createSubCategory = asyncHandler(async (req, res) => {
  const { collectionId, categoryId, name, label, isVisible } = req.body;

  let imageUrl = "";
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, "subcategories");
    imageUrl = result.secure_url;
  }

  const sub = await SubCategoryRepository.create({
    collectionId,
    categoryId,
    name,
    label: label || "",
    imageUrl,
    isVisible: isVisible !== "false",
  });

  res.status(201).json({ success: true, data: sub });
});

// UPDATE
export const updateSubCategory = asyncHandler(async (req, res) => {
  const sub = await SubCategoryRepository.findById(req.params.id);
  if (!sub) {
    return res.status(404).json({ success: false, message: "SubCategory not found" });
  }

  const { collectionId, categoryId, name, label, isVisible } = req.body;

  let imageUrl = sub.imageUrl;
  if (req.file) {
    await deleteFromCloudinary(sub.imageUrl);
    const result = await uploadToCloudinary(req.file.buffer, "subcategories");
    imageUrl = result.secure_url;
  }

  const updated = await SubCategoryRepository.findByIdAndUpdate(req.params.id, {
    collectionId,
    categoryId,
    name,
    label: label || "",
    imageUrl,
    isVisible: isVisible !== "false",
  });

  res.json({ success: true, data: updated });
});

// TOGGLE visibility
export const toggleSubCategoryVisibility = asyncHandler(async (req, res) => {
  const sub = await SubCategoryRepository.findById(req.params.id);
  if (!sub) {
    return res.status(404).json({ success: false, message: "SubCategory not found" });
  }

  sub.isVisible = !sub.isVisible;
  await sub.save();
  res.json({ success: true, data: sub });
});

// DELETE — also deletes products under it
export const deleteSubCategory = asyncHandler(async (req, res) => {
  const sub = await SubCategoryRepository.findById(req.params.id);
  if (!sub) {
    return res.status(404).json({ success: false, message: "SubCategory not found" });
  }

  await deleteFromCloudinary(sub.imageUrl);
  await ProductRepository.deleteMany({ subCategoryId: req.params.id });
  await SubCategoryRepository.deleteOne({ _id: req.params.id });

  res.json({ success: true, message: "SubCategory and its products deleted successfully" });
});