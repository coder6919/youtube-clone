import Video from '../models/video.js';
import Channel from '../models/channel.js';

import jwt from 'jsonwebtoken';

// @desc    Create a new video
// @route   POST /api/videos
// @access  Private
export const createVideo = async (req, res) => {
    try {
        const { title, description, thumbnailUrl, videoUrl, category } = req.body;

        // 1. Find the channel owned by this user
        const channel = await Channel.findOne({ owner: req.user.id });

        if (!channel) {
            return res.status(400).json({ message: "You must create a channel before uploading a video" });
        }

        // 2. Create the video
        const newVideo = new Video({
            uploader: req.user.id,
            title,
            description,
            thumbnailUrl,
            videoUrl,
            category,
            channelId: channel._id
        });

        const savedVideo = await newVideo.save();

        // 3. Update Channel's video list
        if (!channel.videos) {
            channel.videos = [];
        }
        channel.videos.push(savedVideo._id);
        await channel.save();

        res.status(201).json(savedVideo);

    } catch (error) {
        res.status(500).json({ message: "Failed to create video", error: error.message });
    }
};

// @desc    Get all videos (Support Search & Filter)
// @route   GET /api/videos
// @access  Public
export const getAllVideos = async (req, res) => {
    try {
        const { category, search } = req.query;

        // DEBUG LOG: See what the frontend is sending
        console.log(`Fetching videos. Category: ${category}, Search: ${search}`);

        let query = {};

        // Filter by Category (Exact Match)
        if (category && category !== "All") {
            query.category = category;
        }

        // Search by Title (Case Insensitive Regex)
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        // DEBUG LOG: See the final query object
        console.log("MongoDB Query:", query);

        const videos = await Video.find(query).populate('uploader', 'username avatar');

        res.status(200).json(videos);
    } catch (error) {
        console.error("ERROR in getAllVideos:", error); // Log the crash details
        res.status(500).json({ message: "Failed to fetch videos", error: error.message });
    }
};

// @desc    Get single video by ID
// @route   GET /api/videos/:id
// @access  Public
export const getVideoById = async (req, res) => {
    try {
        console.log("-----------------------------------------");
        console.log("1. getVideoById HIT! ID:", req.params.id);

        // Attempt to find the video
        // Note: We use populate to get the Uploader's info (name/avatar)
        const video = await Video.findById(req.params.id).populate('uploader', 'username avatar subscribers');

        if (!video) {
            console.log("2. Video NOT FOUND in DB");
            return res.status(404).json({ message: "Video not found" });
        }
        

        // Respond
        res.status(200).json(video);
        console.log("3. Data sent to frontend");
        console.log("-----------------------------------------");

    } catch (error) {
        console.error("CRITICAL ERROR in getVideoById:", error);
        res.status(500).json({ message: "Error fetching video", error: error.message });
    }
};

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Private (Owner only)
export const deleteVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: "Video not found" });

        if (video.uploader.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only delete your own videos" });
        }

        await video.deleteOne();
        res.status(200).json({ message: "Video deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting video", error: error.message });
    }
};

// @desc    Update video details
// @route   PUT /api/videos/:id
// @access  Private (Owner only)
export const updateVideo = async (req, res) => {
    try {
        // 1. Log what the frontend sent
        // console.log("UPDATE REQUEST RECEIVED. ID:", req.params.id);
        // console.log("Body Data:", req.body);

        const { title, description, thumbnailUrl, category } = req.body;

        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: "Video not found" });

        if (video.uploader.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only edit your own videos" });
        }

        // 2. Update fields
        video.title = title || video.title;
        video.description = description || video.description;
        video.thumbnailUrl = thumbnailUrl || video.thumbnailUrl;

        // CRITICAL: Ensure category is updated
        if (category) {
            // console.log("Updating category to:", category);
            video.category = category;
        }

        const updatedVideo = await video.save();

        // 3. Log the result
        console.log("Video saved successfully with category:", updatedVideo.category);

        res.status(200).json(updatedVideo);
    } catch (error) {
        console.error("Update failed:", error);
        res.status(500).json({ message: "Update failed", error: error.message });
    }
};

// @desc    Like a video
// @route   PUT /api/videos/:id/like
export const likeVideo = async (req, res) => {
  try {
    const userId = req.user.id;
    const videoId = req.params.id;

    // 1. Check if video exists & get current state
    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // 2. Determine Action
    // Check if user has already liked the video
    // We use strict string comparison to be safe
    const isLiked = video.likes.some(id => id.toString() === userId);

    let updatedVideo;

    if (isLiked) {
      // Action: UN-LIKE (Remove user from likes)
      updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $pull: { likes: userId } }, // Remove ID from likes array
        { new: true } // Return the updated document
      );
    } else {
      // Action: LIKE (Add to likes, Remove from dislikes)
      updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { 
          $addToSet: { likes: userId }, // Add ID to likes (avoid duplicates)
          $pull: { dislikes: userId }   // Remove ID from dislikes
        },
        { new: true }
      );
    }

    res.status(200).json(updatedVideo);
  } catch (error) {
    console.error("LIKE ERROR:", error);
    res.status(500).json({ message: "Failed to like video", error: error.message });
  }
};

// @desc    Dislike a video
// @route   PUT /api/videos/:id/dislike
export const dislikeVideo = async (req, res) => {
  try {
    const userId = req.user.id;
    const videoId = req.params.id;

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const isDisliked = video.dislikes.some(id => id.toString() === userId);

    let updatedVideo;

    if (isDisliked) {
      // Action: UN-DISLIKE (Remove user from dislikes)
      updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $pull: { dislikes: userId } },
        { new: true }
      );
    } else {
      // Action: DISLIKE (Add to dislikes, Remove from likes)
      updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { 
          $addToSet: { dislikes: userId },
          $pull: { likes: userId }
        },
        { new: true }
      );
    }

    res.status(200).json(updatedVideo);
  } catch (error) {
    console.error("DISLIKE ERROR:", error);
    res.status(500).json({ message: "Failed to dislike video", error: error.message });
  }
};

// @desc    Increment view count (Unique per user OR IP)
// @route   PUT /api/videos/:id/view
export const addView = async (req, res) => {
  try {
    const videoId = req.params.id;
    let viewer = req.ip; // Default to IP for guests

    // --- MANUAL TOKEN CHECK ---
    // Even though this route is public, we check if a token exists
    // so we can track logged-in users by their ID instead of IP.
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        viewer = decoded.id; // Use User ID if available
      } catch (error) {
        // Token invalid/expired? Just stick with IP.
      }
    }
    // --------------------------

    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      { $addToSet: { viewedBy: viewer } },
      { new: true }
    );

    if (!updatedVideo) return res.status(404).json({ message: "Video not found" });

    // Sync the number
    updatedVideo.views = updatedVideo.viewedBy.length;
    await updatedVideo.save();

    res.status(200).json(updatedVideo);
  } catch (error) {
    console.error("View Error:", error);
    res.status(500).json({ message: "Failed to count view" });
  }
};