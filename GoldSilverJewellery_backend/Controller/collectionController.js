import CollectionRepository from "../repositories/CollectionRepository.js";
import CategoryRepository from "../repositories/CategoryRepository.js";
import SubCategoryRepository from "../repositories/SubCategoryRepository.js";
import ProductRepository from "../repositories/ProductRepository.js";
import asyncHandler from "../middleware/asyncHandler.js";

// GET all — admin (includes hidden & aggregated counts)
export const getAllCollectionsAdmin = asyncHandler(async (req, res) => {
  const collections = await CollectionRepository.find({}, null, { sort: { createdAt: 1 }, lean: true });
  if (!collections || collections.length === 0) {
    return res.json({ success: true, data: [] });
  }

  const collectionIds = collections.map((c) => c._id);

  const [catCounts, subCatCounts, productCounts] = await Promise.all([
    CategoryRepository.aggregate([
      { $match: { collectionId: { $in: collectionIds } } },
      { $group: { _id: "$collectionId", count: { $sum: 1 } } },
    ]),
    SubCategoryRepository.aggregate([
      { $match: { collectionId: { $in: collectionIds } } },
      { $group: { _id: "$collectionId", count: { $sum: 1 } } },
    ]),
    ProductRepository.aggregate([
      { $match: { collectionId: { $in: collectionIds } } },
      { $group: { _id: "$collectionId", count: { $sum: 1 } } },
    ]),
  ]);

  const catMap = new Map(catCounts.map((i) => [i._id.toString(), i.count]));
  const subCatMap = new Map(subCatCounts.map((i) => [i._id.toString(), i.count]));
  const productMap = new Map(productCounts.map((i) => [i._id.toString(), i.count]));

  const data = collections.map((col) => ({
    ...col,
    categoryCount: catMap.get(col._id.toString()) || 0,
    subCategoryCount: subCatMap.get(col._id.toString()) || 0,
    productCount: productMap.get(col._id.toString()) || 0,
  }));

  res.json({ success: true, data });
});

// GET all — storefront (visible only)
export const getAllCollections = asyncHandler(async (req, res) => {
  const data = await CollectionRepository.find({ isVisible: true }, null, { sort: { createdAt: 1 } });
  res.json({ success: true, data });
});

// CREATE
export const createCollection = asyncHandler(async (req, res) => {
  const { name, isVisible } = req.body;
  const col = await CollectionRepository.create({
    name,
    isVisible: isVisible !== "false",
  });
  res.status(201).json({ success: true, data: col });
});

// UPDATE
export const updateCollection = asyncHandler(async (req, res) => {
  const { name, isVisible } = req.body;
  const col = await CollectionRepository.findByIdAndUpdate(req.params.id, {
    name,
    isVisible: isVisible !== "false",
  });
  if (!col) {
    return res.status(404).json({ success: false, message: "Collection not found" });
  }
  res.json({ success: true, data: col });
});

// TOGGLE visibility
export const toggleCollectionVisibility = asyncHandler(async (req, res) => {
  const col = await CollectionRepository.findById(req.params.id);
  if (!col) {
    return res.status(404).json({ success: false, message: "Collection not found" });
  }
  col.isVisible = !col.isVisible;
  await col.save();
  res.json({ success: true, data: col });
});

// DELETE — also deletes all categories + products under it
export const deleteCollection = asyncHandler(async (req, res) => {
  const col = await CollectionRepository.findById(req.params.id);
  if (!col) {
    return res.status(404).json({ success: false, message: "Collection not found" });
  }

  const cats = await CategoryRepository.find({ collectionId: req.params.id });
  const catIds = cats.map((c) => c._id);

  await ProductRepository.deleteMany({ categoryId: { $in: catIds } });
  await CategoryRepository.deleteMany({ collectionId: req.params.id });
  await CollectionRepository.deleteOne({ _id: req.params.id });

  res.json({ success: true, message: "Collection and all its data deleted successfully" });
});

// SEED product list categories & subcategories
export const seedCollectionsAndCategories = asyncHandler(async (req, res) => {
  const { seedProductListItems } = await import("../seedData.js");
  const result = await seedProductListItems();
  res.json(result);
});