import ProductRepository from "../repositories/ProductRepository.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryHelper.js";
import asyncHandler from "../middleware/asyncHandler.js";

// GET all — storefront / public
export const getAllProducts = asyncHandler(async (req, res) => {
  const filter = { isVisible: true };
  if (req.query.collection) filter.collectionId = req.query.collection;
  if (req.query.category) filter.categoryId = req.query.category;
  if (req.query.featured === "true") filter.isFeatured = true;

  const data = await ProductRepository.getFilteredProducts(filter, [
    { path: "collectionId", select: "name" },
    { path: "categoryId", select: "name label" },
  ]);

  res.json({ success: true, data });
});

// GET all — admin, filter by collection or category via query params
export const getAllProductsAdmin = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.collection) filter.collectionId = req.query.collection;
  if (req.query.category) filter.categoryId = req.query.category;

  const data = await ProductRepository.getFilteredProducts(filter, [
    { path: "collectionId", select: "name" },
    { path: "categoryId", select: "name label" },
  ]);

  res.json({ success: true, data });
});

// GET by category — admin
export const getProductsByCategoryAdmin = asyncHandler(async (req, res) => {
  const data = await ProductRepository.find(
    { categoryId: req.params.categoryId },
    null,
    {
      populate: { path: "subCategoryId", select: "name" },
      sort: { createdAt: -1 },
    }
  );
  res.json({ success: true, data });
});

// GET by subCategory — admin
export const getProductsBySubCategoryAdmin = asyncHandler(async (req, res) => {
  const data = await ProductRepository.find(
    { subCategoryId: req.params.subCategoryId },
    null,
    { sort: { createdAt: -1 } }
  );
  res.json({ success: true, data });
});

// GET by category — storefront (visible only)
export const getProductsByCategory = asyncHandler(async (req, res) => {
  const data = await ProductRepository.find(
    { categoryId: req.params.categoryId, isVisible: true },
    null,
    { sort: { createdAt: -1 } }
  );
  res.json({ success: true, data });
});

// GET by subCategory — storefront
export const getProductsBySubCategory = asyncHandler(async (req, res) => {
  const data = await ProductRepository.find(
    { subCategoryId: req.params.subCategoryId, isVisible: true },
    null,
    { sort: { createdAt: -1 } }
  );
  res.json({ success: true, data });
});

// GET single
export const getProductById = asyncHandler(async (req, res) => {
  const product = await ProductRepository.findById(req.params.id, null, {
    populate: [
      { path: "collectionId", select: "name" },
      { path: "categoryId", select: "name label" },
      { path: "subCategoryId", select: "name label" },
    ],
  });
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  res.json({ success: true, data: product });
});

// CREATE — accepts up to 5 images via req.files
export const createProduct = asyncHandler(async (req, res) => {
  const {
    collectionId,
    categoryId,
    subCategoryId,
    name,
    label,
    productCode,
    weight,
    price,
    isVisible,
    isFeatured,
    isBestseller,
  } = req.body;

  let images = [];
  if (req.files && req.files.length > 0) {
    const uploads = await Promise.all(
      req.files.map((f) => uploadToCloudinary(f.buffer, "products"))
    );
    images = uploads.map((r) => r.secure_url);
  }

  const product = await ProductRepository.create({
    collectionId,
    categoryId,
    subCategoryId: subCategoryId || null,
    name,
    label: label || "",
    productCode: productCode || "",
    weight: weight || "",
    price,
    images,
    isVisible: isVisible !== "false",
    isFeatured: isFeatured === "true" || isFeatured === true,
    isBestseller: isBestseller === "true" || isBestseller === true,
  });

  res.status(201).json({ success: true, data: product });
});

// UPDATE — can add new images or remove existing ones
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await ProductRepository.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  const {
    collectionId,
    categoryId,
    subCategoryId,
    name,
    label,
    productCode,
    weight,
    price,
    isVisible,
    isFeatured,
    isBestseller,
    keepImages,
  } = req.body;

  const kept = keepImages ? JSON.parse(keepImages) : product.images;
  const removed = product.images.filter((url) => !kept.includes(url));
  await Promise.all(removed.map(deleteFromCloudinary));

  let newImages = [];
  if (req.files && req.files.length > 0) {
    const uploads = await Promise.all(
      req.files.map((f) => uploadToCloudinary(f.buffer, "products"))
    );
    newImages = uploads.map((r) => r.secure_url);
  }

  const images = [...kept, ...newImages].slice(0, 5);

  const updated = await ProductRepository.findByIdAndUpdate(req.params.id, {
    collectionId,
    categoryId,
    subCategoryId: subCategoryId || null,
    name,
    label: label || "",
    productCode: productCode || "",
    weight: weight || "",
    price,
    images,
    isVisible: isVisible !== "false",
    isFeatured: isFeatured === "true" || isFeatured === true,
    isBestseller: isBestseller === "true" || isBestseller === true,
  });

  res.json({ success: true, data: updated });
});

// TOGGLE visibility
export const toggleProductVisibility = asyncHandler(async (req, res) => {
  const product = await ProductRepository.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  product.isVisible = !product.isVisible;
  await product.save();
  res.json({ success: true, data: product });
});

// DELETE
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await ProductRepository.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  await Promise.all(product.images.map(deleteFromCloudinary));
  await ProductRepository.deleteOne({ _id: req.params.id });

  res.json({ success: true, message: "Product deleted successfully" });
});