import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; 
import VideoCard from '../components/VideoCard';
import axios from '../utils/axios';

const Home = () => {
  // --- STATE ---
  const [videos, setVideos] = useState([]);      
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("All");
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --- ROUTER ---
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get("search"); 

  const categories = [
    "All", "Music", "Gaming", "News", "Movies", "Education", "Live", "Sports", "Fashion", "Tech"
  ];

  // --- FETCH VIDEOS ---
  const fetchVideos = async (currentPage, isNewFilter = false) => {
    setLoading(true); 
    setError(null);
    try {
      let url = `/videos?page=${currentPage}&limit=9`;
      
      if (searchQuery) {
        url += `&search=${searchQuery}`;
      } else if (category !== "All") {
        url += `&category=${category}`;
      }

      const { data } = await axios.get(url);

      // If it's a new filter (Category/Search changed), replace videos.
      // If it's just the next page, append them.
      if (isNewFilter) {
        setVideos(data.videos);
      } else {
        setVideos((prev) => [...prev, ...data.videos]);
      }

      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setError(error.response?.data?.message || "Failed to load videos.");
    } finally {
      setLoading(false);
    }
  };

  // --- EFFECT: Handle Search/Category Changes ---
  // Reset page to 1 and fetch fresh data
  useEffect(() => {
    setPage(1);
    fetchVideos(1, true); // true = reset list
  }, [category, searchQuery]);

  // --- HANDLER: Load More ---
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchVideos(nextPage, false); // false = append to list
  };

  const handleCategoryClick = (cat) => {
    setCategory(cat); 
    if (searchQuery) navigate("/"); 
  };

  return (
    <div className="w-full h-full pb-8">
      
      {/* Category Bar */}
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

      {/* Video Grid */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {error && (
            <div className="col-span-full text-center mt-10 text-red-400">
                <p>Error: {error}</p>
            </div>
        )}

        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}

        {!loading && videos.length === 0 && !error && (
          <div className="col-span-full text-center mt-10">
             <p className="text-gray-400 text-lg">No videos found.</p>
          </div>
        )}
      </div>

      {/* Load More Button */}
      {page < totalPages && !loading && (
        <div className="flex justify-center mt-6">
          <button 
            onClick={handleLoadMore}
            className="bg-[#272727] text-white px-6 py-2 rounded-full hover:bg-[#3f3f3f] font-medium transition-colors border border-gray-700"
          >
            Load More
          </button>
        </div>
      )}

      {loading && <p className="text-center text-gray-400 mt-4">Loading...</p>}
    </div>
  );
};

export default Home;