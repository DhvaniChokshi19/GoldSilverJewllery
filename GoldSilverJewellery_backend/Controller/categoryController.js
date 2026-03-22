import Category from "../models/Category.js";
import Product from "../models/Product.js";
import connectCloudinary, { cloudinary } from "../config/cloudinary.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const uploadToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      },
    );
    stream.end(buffer);
  });

const deleteFromCloudinary = async (url) => {
  if (!url) return;
  try {
    const parts = url.split("/");
    const file = parts[parts.length - 1].split(".")[0];
    const folder = parts[parts.length - 2];
    await cloudinary.uploader.destroy(`${folder}/${file}`);
  } catch (err) {
    console.error("Cloudinary delete error:", err.message);
  }
};

// ─── Controllers ──────────────────────────────────────────────────────────────

// GET all for a collection — admin
export const getCategoriesByCollectionAdmin = async (req, res) => {
  try {
    const data = await Category.find({
      collectionId: req.params.collectionId,
    }).sort({ order: 1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET visible for a collection — storefront
export const getCategoriesByCollection = async (req, res) => {
  try {
    const data = await Category.find({
      collectionId: req.params.collectionId,
      isVisible: true,
    }).sort({ order: 1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CREATE
export const createCategory = async (req, res) => {
  try {
    const { name, label, isVisible, order, collectionId } = req.body;

    let imageUrl = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "categories");
      imageUrl = result.secure_url;
    }

    const cat = await Category.create({
      collectionId,
      name,
      label,
      imageUrl,
      isVisible: isVisible === "false" ? false : true,
      order: Number(order) || 0,
    });

    res.status(201).json({ success: true, data: cat });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// UPDATE
export const updateCategory = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat)
      return res.status(404).json({ success: false, message: "Not found" });

    const { name, label, isVisible, order, collectionId } = req.body;

    let imageUrl = cat.imageUrl;
    if (req.file) {
      await deleteFromCloudinary(cat.imageUrl);
      const result = await uploadToCloudinary(req.file.buffer, "categories");
      imageUrl = result.secure_url;
    }

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      {
        collectionId,
        name,
        label,
        imageUrl,
        isVisible: isVisible === "false" ? false : true,
        order: Number(order) || 0,
      },
      { new: true, runValidators: true },
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// TOGGLE visibility
export const toggleCategoryVisibility = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat)
      return res.status(404).json({ success: false, message: "Not found" });
    cat.isVisible = !cat.isVisible;
    await cat.save();
    res.json({ success: true, data: cat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE — deletes image from Cloudinary + all products under it
export const deleteCategory = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat)
      return res.status(404).json({ success: false, message: "Not found" });

    await deleteFromCloudinary(cat.imageUrl);
    await Product.deleteMany({ categoryId: req.params.id });
    await cat.deleteOne();

    res.json({ success: true, message: "Category and its products deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
