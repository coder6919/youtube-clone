import express from 'express';
import { protect } from '../middleware/auth.js';
import { createVideo, deleteVideo, getAllVideos, getVideoById,updateVideo,likeVideo,dislikeVideo,addView } from '../controllers/video.js';

const router = express.Router();

router.put('/:id/view', addView);
// Define routes
// POST /api/videos -> Create video (Protected: Must be logged in)
router.post('/', protect, createVideo)

// GET /api/videos -> Get all videos (Public: Anyone can view)
router.get('/', getAllVideos)

// Like/Dislike Routes  /api/videos/:id/like  /dislike -> (Protected)
router.put('/:id/like', protect, likeVideo);
router.put('/:id/dislike', protect, dislikeVideo);

// GET /api/videos/:id -> Get specific video (Public)
router.get('/find/:id', getVideoById);

// DELETE /api/videos/:id -> Delete video (Protected)
router.delete('/:id', protect, deleteVideo)

// UPDATE /api/videos/:id -> Update video (Protected)
router.put('/:id', protect, updateVideo);



export default router