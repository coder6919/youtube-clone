import React from 'react';
import { Link } from 'react-router-dom';
import { GoHome } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions, MdHistory, MdPlaylistPlay, MdWatchLater } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

const Sidebar = ({ isOpen }) => {
  const mainLinks = [
    { icon: <GoHome size={24} />, name: "Home", link: "/" },
    { icon: <SiYoutubeshorts size={24} />, name: "Shorts", link: "/" },
    { icon: <MdOutlineSubscriptions size={24} />, name: "Subscriptions", link: "/" },
  ];

  const secondaryLinks = [
    { icon: <MdHistory size={24} />, name: "History" },
    { icon: <MdPlaylistPlay size={24} />, name: "Playlists" },
    { icon: <MdWatchLater size={24} />, name: "Watch Later" },
  ];

  return (
    <div 
      className={`bg-[#0F0F0F] h-[calc(100vh-60px)] overflow-y-auto sticky top-[60px] left-0 pb-4 flex flex-col 
      transition-all duration-200 ease-in-out border-r border-[#303030] shrink-0 overflow-hidden 
      ${isOpen ? "w-[240px] px-3" : "w-[72px] px-1 items-center"}`} 
    >
      {/* Section 1: Main Links */}
      <div className="flex flex-col w-full py-3 gap-1">
        {mainLinks.map((item, index) => (
          <Link to={item.link} key={index} 
            className={`flex items-center py-2 rounded-lg hover:bg-[#272727] cursor-pointer text-white
            ${isOpen ? "gap-5 px-3" : "flex-col gap-1 px-0 justify-center h-[74px]"}`}
          >
            <div>{item.icon}</div>
            
            {/* If OPEN: Show text normally */}
            {/* whitespace-nowrap prevents text from breaking layout while closing */}
            <span className={`text-sm font-normal truncate whitespace-nowrap ${!isOpen && "hidden"}`}>
                {item.name}
            </span>
            
            {/* If CLOSED: Show tiny text below icon */}
            {!isOpen && <span className="text-[10px]">{item.name}</span>}
          </Link>
        ))}
      </div>

      {/* Separator - Only show when open or if you want a line in collapsed mode too */}
      {isOpen && <div className="border-t border-[#303030] my-2 w-full"></div>}

      {/* Section 2: Secondary Links (Only visible when Open) */}
      <div className={`flex flex-col w-full py-3 ${!isOpen && "hidden"}`}>
            <h3 className="px-3 mb-2 text-base font-bold flex items-center gap-2 whitespace-nowrap">You {">"}</h3>
            {secondaryLinks.map((item, index) => (
            <div key={index} className="flex items-center gap-5 px-3 py-2 rounded-lg cursor-pointer hover:bg-[#272727]">
                {item.icon}
                <span className="text-sm font-normal whitespace-nowrap">{item.name}</span>
            </div>
            ))}
      </div>

      {/* Sign In Prompt (Only visible when Open) */}
      <div className={`border-t border-[#303030] my-2 pt-4 px-3 text-sm text-gray-400 ${!isOpen && "hidden"}`}>
            <p>Sign in to like videos, comment, and subscribe.</p>
            <Link to="/login">
                <button className="mt-3 flex items-center gap-2 border border-[#303030] rounded-full px-4 py-1 text-[#3ea6ff] font-medium hover:bg-[#263850] cursor-pointer whitespace-nowrap">
                    <FaUserCircle size={24} />
                    Sign in
                </button>
            </Link>
      </div>
    </div>
  );
};

export default Sidebar;