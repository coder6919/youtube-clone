import Channel from '../models/channel.js';
import User from '../models/user.js';


// @desc  Create a new channel
// @route  POST /api/channels
// @access  Private

export const createChannel = async(req, res)=>{
    try{
        const {channelName, description} = req.body

        // Check if user already has a channel
        const existingChannel = await Channel.findOne({owner: req.user.id});
        if(existingChannel){
            return res.status(400).json({message: "You already have a channel"});

        }
        const newChannel = new Channel({
            channelName,
            description,
            owner: req.user.id,
        });

        const savedChannel = await newChannel.save();

        // update the User model to include this channel id
        await User.findByIdAndUpdate(req.user.id, {
            $push: {channels: savedChannel._id}
        });

        res.status(201).json(savedChannel);
    } catch(error){
        res.status(500).json({message: "Failed to create channel", error: error.message});
    }
};

// @desc    Get channel details by ID
// @route   GET /api/channels/:id
// @access  Public
export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate({
        path: 'videos', //  Get the actual Video objects
        populate: {
          path: 'uploader', //  Get the User object inside each Video
          select: 'username avatar' //  Only grab the name and avatar
        }
      });

    if (!channel) return res.status(404).json({ message: "Channel not found" });
    
    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update channel details (Banner, Name, Description)
// @route   PUT /api/channels/:id
export const updateChannelData = async (req, res) => {
  try {
    const { id } = req.params;
    const { channelBanner, channelName, description } = req.body;

    const channel = await Channel.findById(id);
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    // Check ownership
    if (channel.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: "You can only edit your own channel" });
    }

    // Update fields if they exist in the request
    if (channelBanner) channel.channelBanner = channelBanner;
    if (channelName) channel.channelName = channelName;
    if (description) channel.description = description;

    await channel.save();
    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({ message: "Failed to update channel", error: error.message });
  }
};