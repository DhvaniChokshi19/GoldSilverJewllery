import SubCategory     from "../models/subCategory.js";
import Product         from "../models/Product.js";
import { cloudinary }  from "../config/cloudinary.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const uploadToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
    stream.end(buffer);
  });

const deleteFromCloudinary = async (url) => {
  if (!url) return;
  try {
    const parts  = url.split("/");
    const file   = parts[parts.length - 1].split(".")[0];
    const folder = parts[parts.length - 2];
    await cloudinary.uploader.destroy(`${folder}/${file}`);
  } catch (err) { console.error("Cloudinary delete error:", err.message); }
};

// ─── GET all for a category — admin ──────────────────────────────────────────
export const getSubCategoriesByCategoryAdmin = async (req, res) => {
  try {
    const data = await SubCategory.find({ categoryId: req.params.categoryId }).sort({ order: 1 });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ─── GET visible for a category — storefront ─────────────────────────────────
export const getSubCategoriesByCategory = async (req, res) => {
  try {
    const data = await SubCategory.find({ categoryId: req.params.categoryId, isVisible: true }).sort({ order: 1 });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ─── CREATE ───────────────────────────────────────────────────────────────────
export const createSubCategory = async (req, res) => {
  try {
    const { collectionId, categoryId, name, label, isVisible} = req.body;

    let imageUrl = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "subcategories");
      imageUrl = result.secure_url;
    }

    const sub = await SubCategory.create({
      collectionId, categoryId,
      name,
      label:     label     || "",
      imageUrl,
      isVisible: isVisible === "false" ? false : true,
    });

    res.status(201).json({ success: true, data: sub });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
export const updateSubCategory = async (req, res) => {
  try {
    const sub = await SubCategory.findById(req.params.id);
    if (!sub) return res.status(404).json({ success: false, message: "Not found" });

    const { collectionId, categoryId, name, label, isVisible} = req.body;

    let imageUrl = sub.imageUrl;
    if (req.file) {
      await deleteFromCloudinary(sub.imageUrl);
      const result = await uploadToCloudinary(req.file.buffer, "subcategories");
      imageUrl = result.secure_url;
    }

    const updated = await SubCategory.findByIdAndUpdate(
      req.params.id,
      { collectionId, categoryId, name, label: label || "", imageUrl,
        isVisible: isVisible === "false" ? false : true,
        },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

// ─── TOGGLE visibility ────────────────────────────────────────────────────────
export const toggleSubCategoryVisibility = async (req, res) => {
  try {
    const sub = await SubCategory.findById(req.params.id);
    if (!sub) return res.status(404).json({ success: false, message: "Not found" });
    sub.isVisible = !sub.isVisible;
    await sub.save();
    res.json({ success: true, data: sub });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ─── DELETE — also deletes products under it ──────────────────────────────────
export const deleteSubCategory = async (req, res) => {
  try {
    const sub = await SubCategory.findById(req.params.id);
    if (!sub) return res.status(404).json({ success: false, message: "Not found" });

    await deleteFromCloudinary(sub.imageUrl);
    await Product.deleteMany({ subCategoryId: req.params.id });
    await sub.deleteOne();

    res.json({ success: true, message: "SubCategory and its products deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};