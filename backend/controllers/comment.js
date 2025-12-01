import Comment from '../models/comment.js';
import Video from '../models/video.js';


// @desc Add a comment to a video
// @route POST /api//comments
// @access Private

export const addComment = async(req, res)=>{
    try{
        const {videoId, text} = req.body
        // 1 Verify the video exists
        const video = await Video.findById(videoId);
        if(!video){
            return res.status(404).json({message: "Video not found"});

        }

        // 2 Create the new comment
        const newComment = new Comment({
            userId: req.user.id, // From auth middleware
            videoId,
            text
        });

        const savedComment = await newComment.save();
        
        //3 Link comment to the video model
        // Ensure comments array exists
        if(!video.comments){
            video.comments = [];
        }

        video.comments.push(savedComment._id);
        await video.save()

        res.status(201).json(savedComment)
    } catch(error){
        res.status(500).json({message: "Failed to add comment", error: error.message})
    }
};

// @desc Get all comments for a specific video
// @route GET /api/comments/:videoId
// @access Public

export const getCommentsByVideoId = async(req, res)=>{
    try{
        // Find comments matching the videoId
        // .populate('userId') fetches the username and avatar of the commenter
        const comments = await Comment.find({videoId: req.params.videoId})
            .populate('userId', 'username avatar')
            .sort({timestamp: -1}); // newest first

        res.status(200).json(comments)
    } catch(error){
        res.status(500).json({message: "Failed to fetch comments", error: error.message});
    }
};

// @desc Edit a comment
// @route PUT /api/comments/:id
// @access Private (Owner only)

export const editComment = async(req,res)=>{
    try{
        const {text} = req.body
        const comment = await Comment.findById(req.params.id);

        if(!comment){
            return res.status(404).json({message: "Comment not found"});
        }

        // Security check: only the original the authoer can edit
        if(comment.userId.toString() !== req.user.id){
            return res.status(403).json({message: "You can only edit your own comments"})
        }

        comment.text = text;
        await comment.save;

        res.status(200).json(comment);
    } catch(error){
        res.status(500).json({message: "failed to edit comment", error: error.message})
    }
}

// @desc  Delete a comment
// @route  DELETE /api/comments/:id
// @access  Private (Owner only)

export const deleteComment = async(req,res)=>{
    try{
        const comment = await Comment.findById(req.params.id);
        if(!comment){
            return res.status(404).json({message: "comment not found"});
        }
        // Security Check- Only the original authot can delete
        if(comment.userId.toString() !== req.user.id){
            return res.status(403).json({message: "you can only delete your comments"});
        }

        await comment.deleteOne();

        res.status(200).json({message: "Comment deleted"})
    } catch(error){
        res.status(500).json({message: "Failed to delete comment", error: error.message});
    }
};