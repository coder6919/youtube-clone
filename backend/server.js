import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js'
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

// test route 
app.get('/', (req,res)=>{
    res.send('Youtube clone is running...');
})

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})