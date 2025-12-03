import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios';
import CommentList from '../components/CommentList'; // Ensure this path is correct
import { BiLike, BiDislike, BiShare } from "react-icons/bi";
import { HiDownload } from "react-icons/hi";

const VideoDetail = () => {
  const { id } = useParams(); // Get video ID from URL
  const [video, setVideo] = useState(null); // Initialize video state
  const [loading, setLoading] = useState(true);

  // Fetch video data when the component mounts or ID changes
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const { data } = await axios.get(`/videos/${id}`);
        setVideo(data);
      } catch (error) {
        console.error("Error fetching video", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id]);

  // 1. Show Loading State while fetching
  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

  // 2. Show Error if video is still null after loading
  if (!video) return <div className="text-white text-center mt-20">Video not found.</div>;

  // 3. Render the Video Player (Only runs if 'video' exists)
  return (
    <div className="w-full bg-[#0F0F0F] text-white p-4 md:p-6 flex flex-col lg:flex-row gap-6">
      
      {/* LEFT SIDE: Video Player & Info */}
      <div className="w-full lg:w-[70%]">
        {/* Video Player Container */}
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-[#303030]">
          <video 
            src={video.videoUrl} 
            controls 
            className="w-full h-full object-contain"
            poster={video.thumbnailUrl}
            autoPlay
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Video Title */}
        <h1 className="text-xl font-bold mt-4 line-clamp-2">{video.title}</h1>

        {/* Channel Info & Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 gap-4">
            
            {/* Channel Info */}
            <div className="flex items-center gap-3">
                <img 
                    src={video.uploader?.avatar || "https://via.placeholder.com/40"} 
                    alt="Channel" 
                    className="w-10 h-10 rounded-full bg-gray-600"
                    onError={(e) => e.target.src = "https://ui-avatars.com/api/?name=User&background=random"}
                />
                <div>
                    <h3 className="font-bold text-base">{video.uploader?.username || "Unknown Channel"}</h3>
                    <p className="text-xs text-gray-400">1.2M subscribers</p>
                </div>
                <button className="ml-4 bg-white text-black px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-200 cursor-pointer">
                    Subscribe
                </button>
            </div>

            {/* Actions (Like/Dislike) */}
            <div className="flex gap-2">
                <div className="flex items-center bg-[#272727] rounded-full overflow-hidden">
                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-[#3f3f3f] border-r border-[#3f3f3f] cursor-pointer">
                        <BiLike size={20} /> {video.likes}
                    </button>
                    <button className="px-4 py-2 hover:bg-[#3f3f3f] cursor-pointer">
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

        {/* Description Box */}
        <div className="bg-[#272727] p-3 rounded-xl mt-4 text-sm whitespace-pre-wrap">
            <p className="font-bold mb-1">{video.views} views • {new Date(video.createdAt).toLocaleDateString()}</p>
            <p>{video.description}</p>
        </div>

        {/* Comments Section */}
        <CommentList videoId={video._id} />
      </div>

      {/* RIGHT SIDE: Recommended Videos */}
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