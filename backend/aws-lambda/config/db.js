import mongoose from "mongoose";

const connectDB = async () => {
  // Reuse existing connection if already connected
  if (mongoose.connection.readyState === 1) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    // added maxPoolSize to manage concurrent connections efficiently
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 5, // Limits each Lambda instance to 5 connections
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error; // let Lambda handler catch it
  }
};

export default connectDB;