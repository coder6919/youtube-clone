import express from 'express';
import { addComment, deleteComment, editComment, getCommentsByVideoId } from '../controllers/comment.js';
import { protect } from '../middleware/auth.js';



const router = express.Router()

// POST /api/comments -> Add comment (Protected)
router.post('/', protect, addComment)

// GET /api/comments/:videoId -> Get comments for a video (Public)
// We use :videoId here to distinguish which video we are looking at
router.get('/:videoId', getCommentsByVideoId)

//PUT /api/comments/:id -> edit commet (protected)
router.put('/:id', protect, editComment)

// DELETE /api/comments/:id -> Delete comment (protected)
router.delete('/:id', protect, deleteComment);

export default router