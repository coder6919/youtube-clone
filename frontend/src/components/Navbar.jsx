import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdMic } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { FaVideo, FaBell, FaUserCircle } from "react-icons/fa";

// Make sure toggleSidebar is destructured here
const Navbar = ({ toggleSidebar }) => {
    console.log("Navbar received toggleSidebar prop:", typeof toggleSidebar);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) navigate(`/?search=${searchQuery}`);
    };

    return (
        <nav className="flex justify-between items-center px-4 py-2 bg-[#0F0F0F] sticky top-0 z-50 h-14">
            {/* 1. Left Section */}
            <div className="flex items-center gap-4">
                {/* THE TRIGGER BUTTON */}
                <button
                    onClick={() => {
                        console.log("Button element clicked!"); // IMMEDIATE LOG
                        toggleSidebar();
                    }}
                    className="p-2 hover:bg-[#272727] rounded-full cursor-pointer transition-colors"
                >
                    <RxHamburgerMenu size={24} color="white" />
                </button>

                <Link to="/" className="flex items-center gap-1" title="YouTube Home">
                    <div className="text-white text-xl font-bold flex items-center tracking-tighter">
                        <span className="text-[#FF0000]">You</span>Tube
                    </div>
                </Link>
            </div>

            {/* 2. Middle Section: Search */}
            <div className="hidden md:flex items-center w-1/2 max-w-[600px]">
                <form onSubmit={handleSearch} className="flex w-full">
                    <div className="flex w-full items-center bg-[#121212] border border-[#303030] rounded-l-full px-4 py-0 focus-within:border-[#1c62b9] ml-8 h-10">
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full bg-transparent outline-none text-white text-base font-normal placeholder-gray-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="bg-[#222] border border-l-0 border-[#303030] px-5 rounded-r-full hover:bg-[#303030] cursor-pointer h-10 flex items-center justify-center">
                        <CiSearch size={24} color="white" />
                    </button>
                </form>
                <button className="ml-4 p-2 bg-[#121212] rounded-full hover:bg-[#303030] cursor-pointer">
                    <IoMdMic size={24} color="white" />
                </button>
            </div>

            {/* 3. Right Section */}
            <div className="flex items-center gap-2 sm:gap-4">
                {token ? (
                    <>
                        <FaVideo size={20} className="cursor-pointer hover:text-white text-gray-200 hidden sm:block" />
                        <FaBell size={20} className="cursor-pointer hover:text-white text-gray-200 hidden sm:block" />
                        <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogout}>
                            <img
                                src={user?.avatar || "https://via.placeholder.com/30"}
                                alt="Avatar"
                                className="w-8 h-8 rounded-full bg-gray-500"
                            />
                        </div>
                    </>
                ) : (
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