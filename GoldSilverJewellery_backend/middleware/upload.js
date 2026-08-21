import multer from "multer";

const storage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: imageFilter,
});

export const uploadSingleImage = (fieldName) => upload.single(fieldName);
export const uploadArrayImages = (fieldName, maxCount = 5) => upload.array(fieldName, maxCount);

export default upload;