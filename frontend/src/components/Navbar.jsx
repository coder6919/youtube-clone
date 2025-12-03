import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Importing Icons
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdMic } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { FaVideo, FaBell, FaUserCircle } from "react-icons/fa";

const Navbar = ({ toggleSidebar }) => {
  // State to hold the text typed in search bar
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  // 1. Retrieve User Info from Local Storage
  // We check 'token' to see if user is logged in
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  // 2. Dynamic Channel Link Logic
  // Check if the user has a channel ID in their data.
  // We use optional chaining (?.) to prevent crashes if 'user' or 'channels' is null.
  const myChannelId = user?.channels?.[0]; 

  // 3. Logout Logic
  const handleLogout = () => {
    // Clear auth data so the app knows we are logged out
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect user to the login page
    navigate('/login');
  };

  // 4. Search Handler
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent full page reload
    if (searchQuery.trim()) {
      // Navigate to Home Page with the search query in URL (e.g., /?search=react)
      navigate(`/?search=${searchQuery}`);
    }
  };

  return (
    <nav className="flex justify-between items-center px-4 py-2 bg-[#0F0F0F] sticky top-0 z-50 h-14 border-b border-[#272727]">
      
      {/* --- LEFT SECTION: Hamburger & Logo --- */}
      <div className="flex items-center gap-4">
        {/* Toggle Sidebar Prop called on click */}
        <button 
            onClick={toggleSidebar} 
            className="p-2 hover:bg-[#272727] rounded-full cursor-pointer transition-colors"
        >
            <RxHamburgerMenu size={24} color="white" />
        </button>

        {/* Logo links back to Home */}
        <Link to="/" className="flex items-center gap-1">
            <div className="text-white text-xl font-bold flex items-center tracking-tighter">
                <span className="text-[#FF0000]">You</span>Tube
            </div>
        </Link>
      </div>

      {/* --- MIDDLE SECTION: Search Bar --- */}
      <div className="hidden md:flex items-center w-1/2 max-w-[600px]">
        <form onSubmit={handleSearch} className="flex w-full">
            <div className="flex w-full items-center bg-[#121212] border border-[#303030] rounded-l-full px-4 py-0 focus-within:border-[#1c62b9] ml-8 h-10">
                <input 
                    type="text" 
                    placeholder="Search" 
                    className="w-full bg-transparent outline-none text-white text-base font-normal placeholder-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // Update state on typing
                />
            </div>
            <button type="submit" className="bg-[#222] border border-l-0 border-[#303030] px-5 rounded-r-full hover:bg-[#303030] cursor-pointer h-10 flex items-center justify-center">
                <CiSearch size={24} color="white" />
            </button>
        </form>
        {/* Mic Icon (Static UI only) */}
        <button className="ml-4 p-2 bg-[#121212] rounded-full hover:bg-[#303030] cursor-pointer">
            <IoMdMic size={24} color="white" />
        </button>
      </div>

      {/* --- RIGHT SECTION: Auth Status & Actions --- */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Conditional Rendering: Check if User is Logged In */}
        {token ? (
            <>
                {/* Icons visible only on larger screens */}
                <FaVideo size={20} className="cursor-pointer hover:text-white text-gray-200 hidden sm:block" />
                <FaBell size={20} className="cursor-pointer hover:text-white text-gray-200 hidden sm:block" />
                
                {/* AVATAR: Click takes you to Channel Page (if it exists) or Home */}
                <Link to={myChannelId ? `/channel/${myChannelId}` : "/channel/new"}>
                    <img 
                        src={user?.avatar || "https://via.placeholder.com/30"} 
                        alt="Avatar" 
                        className="w-8 h-8 rounded-full bg-gray-500 object-cover cursor-pointer"
                        // Fallback if image fails to load
                        onError={(e) => e.target.src = "https://ui-avatars.com/api/?name=User&background=random"}
                    />
                </Link>

                {/* LOGOUT BUTTON: Distinct red button for clarity */}
                <button 
                  onClick={handleLogout} 
                  className="bg-[#cc0000] text-white text-sm font-medium px-4 py-1.5 rounded hover:bg-[#990000] transition-colors"
                >
                  Logout
                </button>
            </>
        ) : (
            // If NOT logged in, show Sign In button
            <Link to="/login">
                <button className="flex items-center gap-2 border border-[#303030] rounded-full px-3 py-1.5 text-[#3ea6ff] font-medium hover:bg-[#263850] cursor-pointer text-sm">
                    <FaUserCircle size={24} />
                    Sign in
                </button>
            </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;