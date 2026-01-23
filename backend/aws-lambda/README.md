# ⚙️ YouTube Clone - Backend

The server-side application built with Node.js and Express. It handles data persistence via MongoDB, file storage via Cloudinary, and authentication via JWT.

# 📦 Core Dependencies

### express
Web framework for handling API routing and middleware.

### mongoose
ODM for MongoDB to define Schemas (User, Video, Channel) and validation.

### multer
Middleware for handling multipart/form-data (file uploads).

### cloudinary
Cloud SDK to upload media files to Cloudinary storage.

### multer-storage-cloudinary
Connects Multer directly to Cloudinary so files aren't stored locally.

### jsonwebtoken
Generates secure tokens for user authentication.

### bcryptjs
Hashes user passwords for security.

### cors
Allows the frontend (running on a different port) to communicate with the API.

# 🗂️ Folder Structure
```
backend/
├── config/            
│   └── db.js          # MongoDB connection logic
├── controllers/       
│   ├── auth.js        # Logic for Register/Login
│   ├── channel.js     # Logic for Channel CRUD
│   ├── comment.js     # Logic for Comment CRUD
│   └── video.js       # Logic for Video CRUD (Upload, Like, View)
├── models/            
│   ├── channel.js     # Mongoose Schema for Channels
│   ├── comment.js     # Mongoose Schema for Comments
│   ├── user.js        # Mongoose Schema for Users
│   └── video.js       # Mongoose Schema for Videos
├── routes/            
│   ├── auth.js        # Auth API endpoints
│   ├── channels.js    # Channel API endpoints
│   ├── comments.js    # Comment API endpoints
│   ├── upload.js      # File Upload route (Cloudinary)
│   └── videos.js      # Video API endpoints
├── middleware/        
│   └── auth.js        # JWT protection middleware
├── .env               # Environment variables (MONGO_URI, Cloudinary Keys)
├── server.js          # Main entry point (App configuration)
└── package.json       # Dependencies and scripts
```

# 🗄️ Database Schema (MongoDB)

### 1. User

username, email, password (hashed)

avatar: String (URL)

channels: Array of Channel IDs

### 2. Channel

channelName, description

owner: Reference to User

subscribers: Number

videos: Array of Video IDs

channelBanner: String (URL)

### 3. Video

title, description, category

videoUrl, thumbnailUrl: String (Cloudinary URLs)

uploader: Reference to User

views: Number (Unique per user logic)

likes, dislikes: Arrays of User IDs (to prevent duplicate likes)

### 4. Comment

text, videoId, userId, timestamp

# 🔌 API Endpoints

### Authentication

POST /api/auth/register - Create a new user

POST /api/auth/login - Login and receive JWT

### Videos

GET /api/videos - Fetch all videos (supports ?search= and ?category=)

POST /api/videos - Upload a new video metadata (Protected)

GET /api/videos/find/:id - Fetch single video details (Increments View Count)

PUT /api/videos/:id - Edit video details (Owner only)

DELETE /api/videos/:id - Delete video (Owner only)

PUT /api/videos/:id/like - Toggle like status

PUT /api/videos/:id/view - Increment view count (Unique check)

### Channels

POST /api/channels - Create a channel

GET /api/channels/:id - Get channel info + videos

PUT /api/channels/:id - Update channel banner/description

File Uploads

POST /api/upload - Uploads file to Cloudinary and returns URL.

# 🛡️ Security Features

### JWT Middleware: A protect middleware checks for a valid Bearer token in the header before allowing access to sensitive routes (Upload, Edit, Delete).

### Password Hashing: Passwords are never stored in plain text; they are hashed using bcryptjs before saving.

### Ownership Checks: Controllers verify that req.user.id matches the video.uploader ID before allowing Edits or Deletes.

### 🚀 Running Locally
Create a .env file with MONGO_URI, JWT_SECRET, and Cloudinary Credentials.

### Start server:
npm start
