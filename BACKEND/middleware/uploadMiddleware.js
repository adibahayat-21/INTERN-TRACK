import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// ✅ Cloudinary storage config
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "interntrack/internships",
    resource_type: "auto", // pdf + images
  },
});

// ✅ file filter (keep your validation — GOOD PRACTICE)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, PNG, JPG files are allowed"), false);
  }
};

// ✅ multer config
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;
