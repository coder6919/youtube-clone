import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdMic, IoMdArrowBack } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { FaVideo, FaBell, FaUserCircle } from "react-icons/fa";

const Navbar = ({ toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false); // New State
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const myChannelId = user?.channels?.[0]; 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowMobileSearch(false); // Close mobile search on submit
      navigate(`/?search=${searchQuery}`);
    }
  };

  return (
    <nav className="flex justify-between items-center px-4 py-2 bg-[#0F0F0F] sticky top-0 z-50 h-14 border-b border-[#272727]">
      
      {/* --- MOBILE SEARCH OVERLAY --- */}
      {showMobileSearch ? (
        <div className="absolute inset-0 bg-[#0F0F0F] z-50 flex items-center px-2 w-full">
           <button onClick={() => setShowMobileSearch(false)} className="p-2 mr-2">
             <IoMdArrowBack size={24} className="text-white" />
           </button>
           <form onSubmit={handleSearch} className="flex flex-1 items-center bg-[#121212] border border-[#303030] rounded-full px-4 py-1">
              <input 
                autoFocus
                type="text" 
                placeholder="Search" 
                className="w-full bg-transparent outline-none text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit"><CiSearch size={24} className="text-white" /></button>
           </form>
        </div>
      ) : (
        <>
          {/* --- LEFT SECTION --- */}
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="p-2 hover:bg-[#272727] rounded-full cursor-pointer transition-colors">
                <RxHamburgerMenu size={24} color="white" />
            </button>
            <Link to="/" className="flex items-center gap-1">
                <div className="text-white text-xl font-bold flex items-center tracking-tighter">
                    <span className="text-[#FF0000]">You</span>Tube
                </div>
            </Link>
          </div>

          {/* --- DESKTOP SEARCH --- */}
          <div className="hidden md:flex items-center w-1/2 max-w-[600px]">
            <form onSubmit={handleSearch} className="flex w-full">
                <div className="flex w-full items-center bg-[#121212] border border-[#303030] rounded-l-full px-4 h-10">
                    <input 
                        type="text" 
                        placeholder="Search" 
                        className="w-full bg-transparent outline-none text-white placeholder-gray-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="bg-[#222] border border-l-0 border-[#303030] px-5 rounded-r-full hover:bg-[#303030] h-10 flex items-center justify-center">
                    <CiSearch size={24} color="white" />
                </button>
            </form>
          </div>

          {/* --- RIGHT SECTION --- */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Search Icon Trigger */}
            <button onClick={() => setShowMobileSearch(true)} className="md:hidden p-2 hover:bg-[#272727] rounded-full">
               <CiSearch size={24} className="text-white" />
            </button>

            {token ? (
                <>
                    <FaVideo size={20} className="cursor-pointer hover:text-white text-gray-200 hidden sm:block" />
                    <FaBell size={20} className="cursor-pointer hover:text-white text-gray-200 hidden sm:block" />
                    <Link to={myChannelId ? `/channel/${myChannelId}` : "/channel/new"}>
                        <img 
                            src={user?.avatar || "https://via.placeholder.com/30"} 
                            alt="Avatar" 
                            className="w-8 h-8 rounded-full object-cover"
                            onError={(e) => e.target.src = "https://ui-avatars.com/api/?name=User&background=random"}
                        />
                    </Link>
                </>
            ) : (
                <Link to="/login">
                    <button className="flex items-center gap-2 border border-[#303030] rounded-full px-3 py-1.5 text-[#3ea6ff] font-medium text-sm">
                        <FaUserCircle size={24} />
                        <span className="hidden sm:inline">Sign in</span>
                    </button>
                </Link>
            )}
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;