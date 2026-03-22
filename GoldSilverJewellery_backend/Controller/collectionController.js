import Collection from "../models/Collection.js";
import Category   from "../models/Category.js";
import Product    from "../models/Product.js";

// GET all — admin (includes hidden)
export const getAllCollectionsAdmin = async (req, res) => {
  try {
    const data = await Collection.find().sort({ createdAt: 1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET all — storefront (visible only)
export const getAllCollections = async (req, res) => {
  try {
    const data = await Collection.find({ isVisible: true }).sort({ createdAt: 1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CREATE
export const createCollection = async (req, res) => {
  try {
    const { name, isVisible } = req.body;
    const col = await Collection.create({
      name,
      isVisible: isVisible === "false" ? false : true,
    });
    res.status(201).json({ success: true, data: col });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// UPDATE
export const updateCollection = async (req, res) => {
  try {
    const { name, isVisible } = req.body;
    const col = await Collection.findByIdAndUpdate(
      req.params.id,
      { name, isVisible: isVisible === "false" ? false : true },
      { new: true, runValidators: true }
    );
    if (!col) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: col });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// TOGGLE visibility
export const toggleCollectionVisibility = async (req, res) => {
  try {
    const col = await Collection.findById(req.params.id);
    if (!col) return res.status(404).json({ success: false, message: "Not found" });
    col.isVisible = !col.isVisible;
    await col.save();
    res.json({ success: true, data: col });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE — also deletes all categories + products under it
export const deleteCollection = async (req, res) => {
  try {
    const col = await Collection.findById(req.params.id);
    if (!col) return res.status(404).json({ success: false, message: "Not found" });

    const cats = await Category.find({ collectionId: req.params.id });
    const catIds = cats.map((c) => c._id);

    await Product.deleteMany({ categoryId: { $in: catIds } });
    await Category.deleteMany({ collectionId: req.params.id });
    await col.deleteOne();

    res.json({ success: true, message: "Collection and all its data deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};