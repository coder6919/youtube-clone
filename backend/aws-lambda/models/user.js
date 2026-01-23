import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true,}, //Will store hashed password
    avatar: {type: String, default: "https://example.com/default-avatar.png"},
    channels: [{type: mongoose.Schema.Types.ObjectId, ref: 'Channel'}] // user can own channels

})

export default mongoose.model('User', userSchema)