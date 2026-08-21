import { cloudinary } from "../config/cloudinary.js";

/**
 * Upload buffer to Cloudinary in specified folder
 * @param {Buffer} buffer - File buffer
 * @param {string} folder - Target Cloudinary folder
 * @returns {Promise<object>} Upload result object
 */
export const uploadToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });

/**
 * Delete image from Cloudinary by its URL
 * @param {string} url - Secure URL of Cloudinary asset
 */
export const deleteFromCloudinary = async (url) => {
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
