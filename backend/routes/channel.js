import express from 'express';
import { createChannel, getChannelById } from '../controllers/channel.js';
import {protect} from '../middleware/auth.js'

const router = express.Router()

router.post('/', protect, createChannel); // create channel (Protected)
router.get('/:id', getChannelById); // Get channel info (Public)

export default router