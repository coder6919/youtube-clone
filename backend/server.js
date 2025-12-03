import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path'
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js'
import videoRoutes from './routes/videos.js';
import channelRoutes from './routes/channel.js'
import commentRoutes from './routes/comment.js'
import uploadRoutes from './routes/upload.js';

// Load env vars
dotenv.config();

//connect to database
connectDB();

const app = express();

//middleware
app.use(cors());
app.use(express.json())


// Routes
app.use('/api/auth',authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/channels', channelRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/upload', uploadRoutes);

// test route 
app.get('/', (req,res)=>{
    res.send('Youtube clone is running...');
})

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})