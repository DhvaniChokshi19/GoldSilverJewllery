import CategoryRepository from "../repositories/CategoryRepository.js";
import ProductRepository from "../repositories/ProductRepository.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryHelper.js";
import asyncHandler from "../middleware/asyncHandler.js";

// GET all for a collection — admin (uses aggregated counts)
export const getCategoriesByCollectionAdmin = asyncHandler(async (req, res) => {
  const data = await CategoryRepository.getCategoriesWithCounts({
    collectionId: req.params.collectionId,
  });
  res.json({ success: true, data });
});

// GET visible for a collection — storefront (uses aggregated counts)
export const getCategoriesByCollection = asyncHandler(async (req, res) => {
  const data = await CategoryRepository.getCategoriesWithCounts({
    collectionId: req.params.collectionId,
    isVisible: true,
  });
  res.json({ success: true, data });
});

// CREATE
export const createCategory = asyncHandler(async (req, res) => {
  const { name, label, isVisible, order, collectionId } = req.body;

  let imageUrl = "";
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, "categories");
    imageUrl = result.secure_url;
  }

  const cat = await CategoryRepository.create({
    collectionId,
    name,
    label,
    imageUrl,
    isVisible: isVisible !== "false",
    order: Number(order) || 0,
  });

  res.status(201).json({ success: true, data: cat });
});

// UPDATE
export const updateCategory = asyncHandler(async (req, res) => {
  const cat = await CategoryRepository.findById(req.params.id);
  if (!cat) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }

  const { name, label, isVisible, order, collectionId } = req.body;

  let imageUrl = cat.imageUrl;
  if (req.file) {
    await deleteFromCloudinary(cat.imageUrl);
    const result = await uploadToCloudinary(req.file.buffer, "categories");
    imageUrl = result.secure_url;
  }

  const updated = await CategoryRepository.findByIdAndUpdate(req.params.id, {
    collectionId,
    name,
    label,
    imageUrl,
    isVisible: isVisible !== "false",
    order: Number(order) || 0,
  });

  res.json({ success: true, data: updated });
});

// TOGGLE visibility
export const toggleCategoryVisibility = asyncHandler(async (req, res) => {
  const cat = await CategoryRepository.findById(req.params.id);
  if (!cat) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }

  cat.isVisible = !cat.isVisible;
  await cat.save();
  res.json({ success: true, data: cat });
});

// DELETE — deletes image from Cloudinary + all products under it
export const deleteCategory = asyncHandler(async (req, res) => {
  const cat = await CategoryRepository.findById(req.params.id);
  if (!cat) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }

  await deleteFromCloudinary(cat.imageUrl);
  await ProductRepository.deleteMany({ categoryId: req.params.id });
  await CategoryRepository.deleteOne({ _id: req.params.id });

  res.json({ success: true, message: "Category and its products deleted successfully" });
});
