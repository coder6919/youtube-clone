import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'youtube-clone',
    resource_type: 'auto',
    allowed_formats: ['jpg', 'png', 'mp4', 'mov', 'mkv'], // Supports video
  },
});

const upload = multer({ storage,
    limits: { fileSize: 100 * 1024 * 1024 } // Limit to 50MB per file
 });

// 2. Route with Error Handling
router.post('/', (req, res) => {
    const uploadSingle = upload.single('file');

    uploadSingle(req, res, (err) => {
        if (err) {
 
            // Check for specific Cloudinary errors
            if (err.message && err.message.includes("Cloudinary")) {
                return res.status(500).json({ message: "Cloudinary Error: Check API Keys" });
            }
            return res.status(400).json({ message: err.message || "Upload Failed" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        res.send(req.file.path);
    });
});

export default router;