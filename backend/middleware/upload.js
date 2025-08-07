import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// user.resume = req.file.path; 
// await user.save();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const ext = file.originalname.split(".").pop().toLowerCase();
    const filenameWithoutExt = file.originalname.replace(/\.[^/.]+$/, ""); 

    const isDoc = ["pdf", "doc", "docx"].includes(ext);
    const resourceType = isDoc ? "raw" : "auto";

    return {
      folder: "jobportal_uploads",
      resource_type: resourceType,
      use_filename: true,
      unique_filename: false,
      public_id: `${Date.now()}_${filenameWithoutExt}.${ext}`,
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
});

export default upload;
