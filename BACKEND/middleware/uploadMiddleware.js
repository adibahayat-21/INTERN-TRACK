import multer from "multer";
import path from "path";

// storage configuration
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/internships");
    },
    filename:(req,file,cb)=>{
         const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
    }
})

// file filter (pdf & images only)
const fileFilter=(req, file, cb) => {
  const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, PNG, JPG files are allowed"), false);
  }
};

const upload=multer({
    storage,
    fileFilter,
    limits:{fileSize:5*1024*1024},   //5 MB
})

export default upload;