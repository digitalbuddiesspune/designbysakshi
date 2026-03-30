import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Use memory storage; we'll stream to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const folder = req.body.folder || 'designbysakshi';
    const buffer = req.file.buffer;
    const mime = req.file.mimetype;

    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder, resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.end(buffer);
      });

    const result = await streamUpload();
    res.json({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      folder: result.folder,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

