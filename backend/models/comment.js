import mongoose from "mongoose";
import Video from "./video.js";

const commentSchema = new mongoose.Schema({
    videoId: {type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    text: {type: String, required: true},
    timestamp: {type: Date, default: Date.now}
}, {timestamps: true});

export default mongoose.model('Comment', commentSchema);