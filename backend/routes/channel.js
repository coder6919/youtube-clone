import express from 'express';
import { createChannel, getChannelById, updateChannelData } from '../controllers/channel.js';
import {protect} from '../middleware/auth.js'

const router = express.Router()

router.post('/', protect, createChannel); // create channel (Protected)
router.get('/:id', getChannelById); // Get channel info (Public)
router.put('/:id', protect, updateChannelData); // Update channel data (Protected)

export default router