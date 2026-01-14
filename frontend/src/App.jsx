import { Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = React.lazy(() => import('./components/Navbar'));
const Sidebar = React.lazy(() => import('./components/Sidebar'));
const Home = React.lazy(() => import('./pages/Home'));
const VideoDetail = React.lazy(() => import('./pages/VideoDetail'));
const Channel = React.lazy(() => import('./pages/Channel'));
const CreateChannel = React.lazy(() => import('./pages/CreateChannel'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 640);
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <Router>
      <Suspense>
        <div className="flex flex-col h-screen h-[100dvh] overflow-hidden bg-[#0F0F0F] text-white">
          {/* 1. Navbar stays at the top */}
          <Navbar toggleSidebar={toggleSidebar} />

          {/* 2. Main Flex Container: Sidebar + Content */}
          <div className="flex flex-1 overflow-hidden">

            {/* Sidebar sits here, managed directly by App */}
            <Sidebar isOpen={sidebarOpen} />

            {/* Main Content Area (Routes) */}
            <main className="flex-1 overflow-y-auto w-full">
              <Routes>
                {/* We removed the 'sidebarOpen' prop from Home since it doesn't need it anymore */}
                <Route path="/" element={<Home />} />
                <Route path="/video/:id" element={<VideoDetail />} />
                <Route path="/channel/:id" element={<Channel />} />
                <Route path="/channel/new" element={<CreateChannel />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </main>
          </div>

          <ToastContainer theme="dark" position="bottom-right" />
        </div>
      </Suspense>

    </Router>
  );
}

export default App;