import React, { useEffect, useState } from 'react';
import VideoCard from '../components/VideoCard';
import axios from '../utils/axios'; 

// Removed 'Sidebar' import
// Removed 'sidebarOpen' prop

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

  const categories = [
    "All", "Music", "Gaming", "News", "Movies", "Education", "Live", "Sports", "Fashion"
  ];

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const query = category === "All" ? "" : `?category=${category}`;
        const { data } = await axios.get(`/videos${query}`);
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [category]); 

  return (
    <div className="w-full h-full">
      {/* 1. Category Filters (Sticky Header) */}
      <div className="sticky top-0 bg-[#0F0F0F] z-10 pb-3 pt-2 px-4 flex gap-3 overflow-x-auto no-scrollbar w-full border-b border-[#272727]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
              ${category === cat 
                ? "bg-white text-black" 
                : "bg-[#272727] text-white hover:bg-[#3f3f3f]"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 2. Video Grid */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {loading ? (
          <p className="text-white text-center mt-10">Loading videos...</p>
        ) : videos.length > 0 ? (
          videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))
        ) : (
          <p className="text-gray-400 text-center mt-10">No videos found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default Home;