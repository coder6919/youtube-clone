import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

// --- COMPONENTS & ICONS ---
import CommentList from '../components/CommentList';
import { BiLike, BiDislike, BiShare } from "react-icons/bi";
import { HiDownload } from "react-icons/hi";

// --- VIDEO PLAYER (PLYR) ---
import Plyr from "plyr-react";
import "plyr-react/plyr.css"; 

// --- REDUX IMPORT ---
import { useSelector } from 'react-redux';

const VideoDetail = () => {
  const { id } = useParams();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- REDUX STATE ---
  // Get currentUser from Redux instead of localStorage
  const { currentUser } = useSelector(state => state.user);

  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);

  const getOptimizedUrl = (url) => {
    if (!url) return "";
    return url.includes("/upload/") 
      ? url.replace("/upload/", "/upload/f_auto,q_auto/") 
      : url;
  };

  const plyrSource = useMemo(() => {
    if (!video) return null; 
    return {
      type: "video",
      sources: [
        {
          src: getOptimizedUrl(video.videoUrl),
          type: "video/mp4",
        },
      ],
      poster: video.thumbnailUrl, 
    };
  }, [video?.videoUrl, video?.thumbnailUrl]); 

  const plyrOptions = useMemo(() => ({
    autoplay: true,
    controls: [
      'play-large', 'play', 'progress', 'current-time', 'duration', 
      'mute', 'volume', 'captions', 'settings', 'pip', 'fullscreen'
    ],
    speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
  }), []);

  // --- FETCH VIDEO DATA ---
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const { data } = await axios.get(`/videos/find/${id}`);
        setVideo(data);
        
        setLikeCount(data.likes.length);
        setDislikeCount(data.dislikes.length);
        
        // Use currentUser to check likes
        if (currentUser) {
          setUserLiked(data.likes.includes(currentUser._id));
          setUserDisliked(data.dislikes.includes(currentUser._id));
        }
      } catch (error) {
        console.error("Error fetching video", error);
        toast.error("Failed to load video");
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id, currentUser]); // Added currentUser as dependency

  // --- INCREMENT VIEWS ---
  useEffect(() => {
    const triggerView = async () => {
      try {
        const { data } = await axios.put(`/videos/${id}/view`);
        setVideo((prev) => prev ? { ...prev, views: data.views } : prev);
      } catch (error) {
        console.error("View count failed", error);
      }
    };

    const timer = setTimeout(() => triggerView(), 1000);
    return () => clearTimeout(timer);
  }, [id]);

  // --- HANDLERS ---

  const handleLike = async () => {
    if (!currentUser) return toast.error("Please login to like");

    const prevLiked = userLiked;
    const prevCount = likeCount;

    if (userLiked) {
      setUserLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      setUserLiked(true);
      setLikeCount(prev => prev + 1);
      if (userDisliked) {
        setUserDisliked(false);
        setDislikeCount(prev => prev - 1);
      }
    }

    try {
      await axios.put(`/videos/${id}/like`);
    } catch (error) {
      setUserLiked(prevLiked);
      setLikeCount(prevCount);
      toast.error("Failed to like");
    }
  };

  const handleDislike = async () => {
    if (!currentUser) return toast.error("Please login to dislike");

    const prevDisliked = userDisliked;
    const prevCount = dislikeCount;

    if (userDisliked) {
      setUserDisliked(false);
      setDislikeCount(prev => prev - 1);
    } else {
      setUserDisliked(true);
      setDislikeCount(prev => prev + 1);
      if (userLiked) {
        setUserLiked(false);
        setLikeCount(prev => prev - 1);
      }
    }

    try {
      await axios.put(`/videos/${id}/dislike`);
    } catch (error) {
      setUserDisliked(prevDisliked);
      setDislikeCount(prevCount);
      toast.error("Failed to dislike");
    }
  };

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;
  if (!video) return <div className="text-white text-center mt-20">Video not found.</div>;

  return (
    <div className="w-full bg-[#0F0F0F] text-white p-4 md:p-6 flex flex-col lg:flex-row gap-6">

      <div className="w-full lg:w-[70%]">
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-[#303030]">
          <Plyr source={plyrSource} options={plyrOptions} />
        </div>

        <h1 className="text-xl font-bold mt-4 line-clamp-2">{video.title}</h1>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 gap-4">
            
            <div className="flex items-center gap-3">
                <img 
                    src={video.uploader?.avatar || `https://ui-avatars.com/api/?name=${video.uploader?.username}&background=random`} 
                    alt="Channel" 
                    className="w-10 h-10 rounded-full bg-gray-600 object-cover"
                    onError={(e) => e.target.src = "https://ui-avatars.com/api/?name=User&background=random"}
                />
                <div>
                    <h3 className="font-bold text-base">{video.channelId?.channelName || video.uploader?.username}</h3>
                    <p className="text-xs text-gray-400">{video.channelId?.subscribers || 0} subscribers</p>
                </div>
                <button className="ml-4 bg-white text-black px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-200 cursor-pointer">
                    Subscribe
                </button>
            </div>

            <div className="flex gap-2">
                <div className="flex items-center bg-[#272727] rounded-full overflow-hidden">
                    <button 
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-4 py-2 hover:bg-[#3f3f3f] border-r border-[#3f3f3f] cursor-pointer
                        ${userLiked ? "text-blue-500" : "text-white"}`}
                    >
                        <BiLike size={20} /> {likeCount}
                    </button>
                    <button 
                        onClick={handleDislike}
                        className={`px-4 py-2 hover:bg-[#3f3f3f] cursor-pointer
                        ${userDisliked ? "text-blue-500" : "text-white"}`}
                    >
                        <BiDislike size={20} />
                    </button>
                </div>
                <button className="flex items-center gap-2 bg-[#272727] px-4 py-2 rounded-full hover:bg-[#3f3f3f] font-medium text-sm cursor-pointer">
                    <BiShare size={20} /> Share
                </button>
                <button className="hidden md:flex items-center gap-2 bg-[#272727] px-4 py-2 rounded-full hover:bg-[#3f3f3f] font-medium text-sm cursor-pointer">
                    <HiDownload size={20} /> Download
                </button>
            </div>
        </div>

        <div className="bg-[#272727] p-3 rounded-xl mt-4 text-sm whitespace-pre-wrap">
            <p className="font-bold mb-1">{video.views} views • {new Date(video.createdAt).toLocaleDateString()}</p>
            <p>{video.description}</p>
        </div>

        <CommentList videoId={video._id} />
      </div>

      <div className="w-full lg:w-[30%] flex flex-col gap-4">
        <p className="font-bold text-lg mb-2">Recommended</p>
        {[1, 2, 3, 4, 5].map((_, idx) => (
             <div key={idx} className="flex gap-2 cursor-pointer group">
                <div className="w-40 h-24 bg-gray-800 rounded-lg overflow-hidden relative">
                     <div className="w-full h-full bg-gray-700 animate-pulse"></div> 
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold line-clamp-2 group-hover:text-blue-400">Related Video {idx + 1}</p>
                    <p className="text-xs text-gray-400">Channel Name</p>
                    <p className="text-xs text-gray-400">50K views • 2 days ago</p>
                </div>
             </div>
        ))}
      </div>

    </div>
  );
};

export default VideoDetail;