import express from 'express';
import multer from 'multer';
import FormData from 'form-data';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Pinata upload endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const PINATA_API_KEY = process.env.PINATA_API_KEY;
    const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

    if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
      return res.status(500).json({ message: 'Pinata API keys not configured' });
    }

    // Create form data for Pinata
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Upload to Pinata
    const pinataResponse = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_API_KEY,
          ...formData.getHeaders(),
        },
      }
    );

    res.status(200).json({
      IpfsHash: pinataResponse.data.IpfsHash,
      PinSize: pinataResponse.data.PinSize,
      Timestamp: pinataResponse.data.Timestamp,
    });
  } catch (error: any) {
    console.error('Pinata upload error:', error);
    res.status(500).json({
      message: 'Upload failed',
      error: error.response?.data || error.message,
    });
  }
});

export default router;

