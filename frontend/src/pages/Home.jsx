import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; 
import VideoCard from '../components/VideoCard';
import axios from '../utils/axios';

const Home = () => {
  // --- STATE MANAGEMENT ---
  const [videos, setVideos] = useState([]);      
  const [loading, setLoading] = useState(true);  
  const [category, setCategory] = useState("All"); 

  // --- ROUTER HOOKS ---
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Extract search query from URL
  const searchQuery = searchParams.get("search"); 

  const categories = [
    "All", "Music", "Gaming", "News", "Movies", "Education", "Live", "Sports", "Fashion", "Tech"
  ];

  // --- FETCHING LOGIC ---
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true); 
      try {
        let url = `/videos`;
        
        // Priority Logic: Search > Category > All
        if (searchQuery) {
          url += `?search=${searchQuery}`;
        } else if (category !== "All") {
          url += `?category=${category}`;
        }

        const { data } = await axios.get(url);
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [category, searchQuery]); 

  // --- CATEGORY CLICK HANDLER ---
  const handleCategoryClick = (cat) => {
    setCategory(cat); 
    // If currently searching, clear the search so category filter works
    if (searchQuery) {
      navigate("/"); 
    }
  };

  return (
    <div className="w-full h-full">
      
      {/* --- CATEGORY FILTERS --- */}
      <div className="sticky top-0 bg-[#0F0F0F] z-10 pb-3 pt-2 px-4 flex gap-3 overflow-x-auto no-scrollbar w-full border-b border-[#272727]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
              ${category === cat && !searchQuery 
                ? "bg-white text-black" 
                : "bg-[#272727] text-white hover:bg-[#3f3f3f]"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* --- VIDEO GRID --- */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {loading ? (
          <p className="text-white text-center mt-10">Loading videos...</p>
        ) : videos.length > 0 ? (
          videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))
        ) : (
          <div className="col-span-full text-center mt-10">
             <p className="text-gray-400 text-lg">No videos found.</p>
             {(searchQuery || category !== "All") && (
               <button 
                 onClick={() => { setCategory("All"); navigate("/"); }}
                 className="mt-4 text-blue-400 hover:underline"
               >
                 Clear filters
               </button>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;