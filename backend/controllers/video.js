import Channel from '../models/channel.js';
import Video from '../models/video.js';

//  @desc   Create a new video
//  @route POST /api/videos
//  @access Private (logged in users only)

export const createVideo = async(req, res)=>{
    try{
        // We get video detailes from the frontend from (req.body)
        // We get the user ID from the middleware (req.user.id)

        const {title, description, thumbnailUrl, videoUrl, category} = req.body;


        // find channel owned by this user
        const channel = await Channel.findOne({owner: req.user.id});
        if(!channel){
            return res.status(400).json({message: "You must create a channel before uploading"})
        }
        const newVideo = new Video({
            uploader: req.user.id, // the logged-in user is the uploader
            title,
            description,
            thumbnailUrl,
            videoUrl,
            category, // We need this for the filter feature 
            channelId: channel._id
        })

        // save to mongodb
        const savedVideo = await newVideo.save();
        // add video ID to the channel's video list
        if(!channel.videos){
            channel.videos = [];
        }
        channel.videos.push(savedVideo._id);
        await channel.save();
        res.status(201).json(savedVideo);
    } catch(error){
        res.status(500).json({message: "Failed to create video", error: error.message})
    }
};


// @desc  Get all video (support search & filter)
// @route  Get /api/videos
// @access Public

export const getAllVideos = async (req, res)=>{
    try{
        const {category,search} = req.query // get query params from URL

        // Build a query object based on filter
        let query = {};

        // filter by catagory
        if(category){
            // $regex allows partial matching (searching "react" finds "react learning")
            // $options: 'i' make it case-insensitive
            query.title = {$regex: search, $options: 'i'}
        }

        // fetch videos from DB matching the query
        // .populate() replaces the 'uploader' ID with actual user details (username, avatar)
        const videos = await Video.find(query).populate('uploader', 'username avatar');

        res.status(200).json(videos);

    } catch (error){
        res.status(500).json({message: "Failed to fetch videos", error: error.message})
    }
};


// @desc  Get singe video by ID
// @route Get /api/videos/:id
// @access Public

export const getVideoById = async (req,res)=>{
    try{
        const video = await Video.findById(req.params.id).populate('uploader', 'username avatar')

        if(!video){
            return res.status(404).json({message: "Video not found"});

            // Logic to increament views 

            res.status(200).json(video);

        }
    } catch(error){
        res.status(500).json({message: "Error fetching video", error: error.message})
    }
};

// @desc Delete video
// @route Delete /api/videos/:id
// @access Private (Owner only)

export const deleteVideo = async(req, res)=>{
    try{
        const video = await Video.findById(req.params.id);

        if(!video){
            return res.status(404).json({message: "Video not found"});
        }

        // Seceruty check: Ensure the user deleting the video is the one who uploaded it
        if(video.uploader.toString() != req.user.id){
            return res.status(403).json({message: "You can only delete your own videos"})
        }

        await video.deleteOne();
        res.status(200).json({message: "Video deleted successfully"});
    } catch(error){
        res.status(500).json({message: "Error deleting videos", error: error.message})
    }
}