import express from 'express';
import { protect } from '../middleware/auth.js';
import { createVideo, deleteVideo, getAllVideos, getVideoById,updateVideo } from '../controllers/video.js';

const router = express.Router();


// Define routes
// POST /api/videos -> Create video (Protected: Must be logged in)
router.post('/', protect, createVideo)

// GET /api/videos -> Get a;; videos (Public: Anyone can view)
router.get('/', getAllVideos)

// GET /api/videos/:id -> Get specific video (Public)
router.get('/:id', getVideoById)

// DELETE /api/videos/:id -> Delete video (Protected)
router.delete('/:id', protect, deleteVideo)

// UPDATE /api/videos/:id -> Update video (Protected)
router.put('/:id', protect, updateVideo);

export default router