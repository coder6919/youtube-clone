import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {type: String, required: true},
    thumbnailUrl: {type: String, required: true},
    description: {type: String},
    category: {type: String, default: "Education"},
    channelId: {type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true},
    uploader: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    views: {type: Number, default: 0},
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default: 0},
    uploadDate: {type: Date, default: Date.now},
    videoUrl: {type: String, required: true},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref:'Comment'}],
}, {timestamps: true});

export default mongoose.model('Video', videoSchema)