import mongoose from "mongoose";

const connectDB = async () => {
  // Reuse existing connection if already connected
  if (mongoose.connection.readyState === 1) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error; // let Lambda handler catch it
  }
};

export default connectDB;
