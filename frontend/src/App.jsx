import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar'; // <--- Import Sidebar here
import Home from './pages/Home';
import VideoDetail from './pages/VideoDetail';
// import Channel from './pages/Channel';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#0F0F0F] text-white">
        {/* 1. Navbar stays at the top */}
        <Navbar toggleSidebar={toggleSidebar} />
        
        {/* 2. Main Flex Container: Sidebar + Content */}
        <div className="flex flex-1 overflow-hidden h-[calc(100vh-56px)]">
          
          {/* Sidebar sits here, managed directly by App */}
          <Sidebar isOpen={sidebarOpen} />
          
          {/* Main Content Area (Routes) */}
          <main className="flex-1 overflow-y-auto w-full">
            <Routes>
              {/* Note: We removed the 'sidebarOpen' prop from Home since it doesn't need it anymore */}
              <Route path="/" element={<Home />} />
              <Route path="/video/:id" element={<VideoDetail />} />
              {/* <Route path="/channel/:id" element={<Channel />} /> */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </div>
        
        <ToastContainer theme="dark" position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;