# 🎥 YouTube Clone (MERN Stack Capstone)

A robust, full-stack video streaming application built with the MERN Stack (MongoDB, Express, React, Node.js). This project replicates core YouTube functionality, including video uploading via Cloudinary, a custom video player using Plyr, channel management, and real-time social interactions.

GitHub - [https://github.com/coder6919/youtube-clone]

# 🚀 Key Features

Responsive UI: Mobile-first design using Tailwind CSS, featuring a toggleable sidebar and adaptive video grids.

Video Player: Professional playback experience using Plyr, supporting speed controls, theater mode, and optimized streaming.

Cloud Storage: Direct file uploads (Videos, Thumbnails, Banners) using Cloudinary to keep the application lightweight and scalable.

Authentication: Secure JWT-based registration and login system.

Channel System: Users can create channels, manage their content (Edit/Delete), and customize their branding (Banners/Avatars).

Search & Discovery: Real-time search by title and category-based filtering (Gaming, Music, Tech, etc.).

Optimistic UI: Instant visual feedback for Likes, Dislikes, and Views to ensure a lag-free user experience.

# 🛠️ Tech Stack Overview


# Frontend

React (Vite), Tailwind CSS, React Router DOM, Axios, Plyr

# Backend

Node.js, Express.js, Multer

### Database

MongoDB Atlas (Mongoose ODM)

### Storage

Cloudinary (Media Management)

### Auth

JSON Web Tokens (JWT), BcryptJS

# ⚙️ Quick Start Guide

### 1. Clone the Repository

git clone <REPO_URL>
cd youtube-clone


### 2. Setup Backend

Navigate to the backend: cd backend

Install dependencies: npm install

# Create a .env file in backend/ with the following:
```
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_secret_key>
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
```

### Start the server: npm start

### 3. Setup Frontend

### Open a new terminal.

### Navigate to the frontend: cd frontend

### Install dependencies: npm install

### Start the app: npm run dev

# 📂 Project Architecture
```
/root
├── backend/          # API, Database Models, and Upload Logic
│   └── README.md     # Backend specific documentation
├── frontend/         # React Application and Components
│   └── README.md     # Frontend specific documentation
└── README.md         # This file
```

# 🎥 Demo

[https://drive.google.com/drive/folders/1PHg4GSdIIZIPl9xISrrDLgKu4aDISBKv?usp=drive_link]