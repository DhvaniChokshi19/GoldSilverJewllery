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

// GET all — admin, filter by collection or category via query params
export const getAllProductsAdmin = async (req, res) => {
  try {
    const filter = {};
    if (req.query.collection) filter.collectionId = req.query.collection;
    if (req.query.category) filter.categoryId = req.query.category;

    const data = await Product.find(filter)
      .populate("collectionId", "name")
      .populate("categoryId", "name label")
      .sort({ createdAt: -1 });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET by category — admin (includes products with or without subCategory)
export const getProductsByCategoryAdmin = async (req, res) => {
  try {
    const data = await Product.find({ categoryId: req.params.categoryId })
      .populate("subCategoryId", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET by subCategory — admin
export const getProductsBySubCategoryAdmin = async (req, res) => {
  try {
    const data = await Product.find({ subCategoryId: req.params.subCategoryId })
      .sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET by category — storefront (visible only)
export const getProductsByCategory = async (req, res) => {
  try {
    const data = await Product.find({
      categoryId: req.params.categoryId,
      isVisible: true,
    }).sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET by subCategory — storefront
export const getProductsBySubCategory = async (req, res) => {
  try {
    const data = await Product.find({ subCategoryId: req.params.subCategoryId, isVisible: true })
      .sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET single
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("collectionId", "name")
      .populate("categoryId", "name label")
      .populate("subCategoryId", "name label");
    if (!product)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CREATE — accepts up to 5 images via req.files
export const createProduct = async (req, res) => {
  try {
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

    // Upload all images to Cloudinary in parallel
    let images = [];
    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map((f) => uploadToCloudinary(f.buffer, "products")),
      );
      images = uploads.map((r) => r.secure_url);
    }

    const product = await Product.create({
      collectionId,
      categoryId,
      subCategoryId: subCategoryId || null,
      name,
      label: label || "",
      productCode: productCode || "",
      weight: weight || "",
      price,
      images,
      isVisible: isVisible === "false" ? false : true,
      isFeatured: isFeatured === "true",
      isBestseller: isBestseller === "true",
    });

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// UPDATE — can add new images or remove existing ones
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: "Not found" });

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
      keepImages, // JSON string array of existing image URLs to keep
    } = req.body;

    // Images to keep from existing ones
    const kept = keepImages ? JSON.parse(keepImages) : product.images;

    // Delete removed images from Cloudinary
    const removed = product.images.filter((url) => !kept.includes(url));
    await Promise.all(removed.map(deleteFromCloudinary));

    // Upload newly added images
    let newImages = [];
    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map((f) => uploadToCloudinary(f.buffer, "products")),
      );
      newImages = uploads.map((r) => r.secure_url);
    }

    const images = [...kept, ...newImages].slice(0, 5); // enforce max 5

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        collectionId,
        categoryId,
        subCategoryId: subCategoryId || null,
        name,
        label: label || "",
        productCode: productCode || "",
        weight: weight || "",
        price,
        images,
        isVisible: isVisible === "false" ? false : true,
        isFeatured: isFeatured === "true",
        isBestseller: isBestseller === "true",
      },
      { new: true, runValidators: true },
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// TOGGLE visibility
export const toggleProductVisibility = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: "Not found" });
    product.isVisible = !product.isVisible;
    await product.save();
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE — removes all Cloudinary images too
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: "Not found" });

    await Promise.all(product.images.map(deleteFromCloudinary));
    await product.deleteOne();

    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};