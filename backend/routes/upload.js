const express = require('express');
const cloudinary = require('cloudinary').v2;
const { authMiddleware } = require('../auth');

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post('/', authMiddleware, async (req, res) => {
  const { image } = req.body || {};
  if (!image) return res.status(400).json({ error: 'image (base64 data URL) required' });
  if (!process.env.CLOUDINARY_CLOUD_NAME) return res.status(503).json({ error: 'Cloudinary not configured' });
  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: 'reserve-coach',
      resource_type: 'auto',
      transformation: [
        {
          quality: 'auto',
          fetch_format: 'auto',
          width: 1600,
          crop: 'limit',
        },
      ],
    });
    res.json({ url: result.secure_url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
