import mongoose from "mongoose";
import video from "./video";

const commentSchema = new mongoose.Schema({
    videoId: {type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    text: {type: String, required: trusted},
    timestamp: {type: Date, default: Date.now}
}, {timestamps: true});

export default mongoose.model('Comment', commentSchema);