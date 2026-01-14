import React from 'react';
import { Link } from 'react-router-dom';
import { getOptimizedUrl } from '../utils/cloudinary';
// import { formatDistanceToNow } from 'date-fns'; // Optional: for "2 days ago"
// If you don't want to install date-fns, you can just print the date string directly

const VideoCard = ({ video, index }) => {

  const handleImageError = (e) => {
    e.target.src = "https://ui-avatars.com/api/?name=Video&background=random"; // Fallback image
  };

  const optimizedThumbnail = getOptimizedUrl(video.thumbnailUrl, 400, 225);

  return (
    <Link to={`/video/${video._id}`} className="flex flex-col gap-2 cursor-pointer group">
      {/* Thumbnail Container */}
      <div className="relative rounded-xl overflow-hidden aspect-video">
        <img
          src={optimizedThumbnail}
          alt={video.title}
          onError={handleImageError}
          // 2. Add these performance attributes:
          loading={index < 4 ? "eager" : "lazy"}
          fetchpriority={index === 0 ? "high" : "auto"}
          // 3. Keep your existing classes:
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
        />

      </div>

      {/* Info Section */}
      <div className="flex gap-3 items-start mt-1">
        {/* Channel Avatar */}
        <div className="flex-shrink-0">
          <img
            src={video.uploader?.avatar || "https://via.placeholder.com/36"}
            alt="avatar"
            className="w-9 h-9 rounded-full bg-gray-600"
          />
        </div>

        {/* Text Info */}
        <div className="flex flex-col">
          <h3 className="text-white text-base font-semibold line-clamp-2 leading-tight">
            {video.title}
          </h3>
          <p className="text-gray-400 text-sm mt-1 hover:text-white transition-colors">
            {video.channelId?.channelName || video.uploader?.username || "Unknown Channel"}
          </p>
          <div className="text-gray-400 text-sm flex items-center">
            <span>{video.views} views</span>
            <span className="mx-1">•</span>
            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;