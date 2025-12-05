import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios';
import VideoCard from '../components/VideoCard';
import { toast } from 'react-toastify';
import { FaUpload, FaTrash, FaTimes, FaEdit, FaCamera, FaPen } from 'react-icons/fa';

// --- REDUX IMPORT ---
import { useSelector } from 'react-redux';

const Channel = () => {
    const { id } = useParams();

    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true); 

    // --- REDUX STATE ---
    const { currentUser } = useSelector(state => state.user);

    const [showModal, setShowModal] = useState(false);
    const [showChannelModal, setShowChannelModal] = useState(false);
    const [manageMode, setManageMode] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editVideoId, setEditVideoId] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [videoData, setVideoData] = useState({
        title: "", description: "", thumbnailUrl: "", videoUrl: "", category: "Education"
    });

    const [channelData, setChannelData] = useState({
        channelName: "", description: ""
    });

    useEffect(() => {
        const fetchChannel = async () => {
            try {
                const { data } = await axios.get(`/channels/${id}`);
                setChannel(data);
                setVideos(data.videos || []); 
            } catch (error) {
                console.error("Error fetching channel:", error);
                toast.error("Failed to load channel");
            } finally {
                setLoading(false); 
            }
        };
        fetchChannel();
    }, [id]);

    const uploadFileHandler = async (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        
        setUploading(true);

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.post('/upload', formData, config);
            setVideoData({ ...videoData, [fieldName]: data });
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
            toast.error("File upload failed");
        }
    };

    const handleBannerUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const formData = new FormData();
        formData.append('file', file);

        try {
            const { data: filePath } = await axios.post('/upload', formData, { 
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            await axios.put(`/channels/${id}`, { channelBanner: filePath });
            setChannel(prev => ({ ...prev, channelBanner: filePath }));
            toast.success("Banner updated!");
        } catch (error) {
            toast.error("Failed to update banner");
        }
    };

    const openCreateModal = () => {
        setIsEditing(false);
        setVideoData({ title: "", description: "", thumbnailUrl: "", videoUrl: "", category: "Education" });
        setShowModal(true);
    };

    const openEditModal = (video) => {
        setIsEditing(true);
        setEditVideoId(video._id);
        setVideoData({
            title: video.title,
            description: video.description,
            thumbnailUrl: video.thumbnailUrl,
            videoUrl: video.videoUrl,
            category: video.category
        });
        setShowModal(true);
    };

    const openChannelEdit = () => {
        setChannelData({
            channelName: channel.channelName,
            description: channel.description
        });
        setShowChannelModal(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                const { data } = await axios.put(`/videos/${editVideoId}`, videoData);
                toast.success("Video Updated!");
                setVideos(videos.map(v => v._id === editVideoId ? data : v));
            } else {
                const { data } = await axios.post('/videos', videoData);
                toast.success("Video Uploaded!");
                setVideos([data, ...videos]);
            }
            setShowModal(false); 
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation Failed");
        }
    };

    const handleChannelUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/channels/${id}`, channelData);
            setChannel(prev => ({ 
                ...prev, 
                channelName: channelData.channelName, 
                description: channelData.description 
            }));
            setShowChannelModal(false);
            toast.success("Channel details updated!");
        } catch (error) {
            toast.error("Failed to update channel");
        }
    };

    const handleDeleteVideo = async (videoId) => {
        if (!window.confirm("Are you sure you want to delete this video?")) return;
        try {
            await axios.delete(`/videos/${videoId}`);
            setVideos((prev) => prev.filter(v => v._id !== videoId));
            toast.success("Video deleted");
        } catch (error) {
            toast.error("Failed to delete video");
        }
    };

    const handleChange = (e) => {
        setVideoData({ ...videoData, [e.target.name]: e.target.value });
    };

    if (loading) return <div className="text-white text-center mt-20">Loading...</div>;
    if (!channel) return <div className="text-white text-center mt-20">Channel not found.</div>;

    // --- CHECK OWNERSHIP WITH REDUX STATE ---
    const isOwner = currentUser?._id === channel.owner;

    return (
        <div className="w-full min-h-screen bg-[#0F0F0F] text-white">

            {/* --- BANNER --- */}
            <div className="w-full h-32 md:h-48 bg-gray-800 relative group">
                {channel.channelBanner ? (
                    <img src={channel.channelBanner} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">No Banner</div>
                )}
                
                {isOwner && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                        <label className="cursor-pointer flex flex-col items-center gap-2 text-white font-bold">
                            <FaCamera size={24} />
                            <span>Change Banner</span>
                            <input type="file" className="hidden" onChange={handleBannerUpload} />
                        </label>
                    </div>
                )}
            </div>

            {/* --- HEADER --- */}
            <div className="px-4 md:px-12 py-6 flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-[#303030]">
                <img 
                    src={channel.owner?.avatar || `https://ui-avatars.com/api/?name=${channel.channelName}&background=random`} 
                    alt="Avatar" 
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#0F0F0F] -mt-4 bg-gray-600 object-cover" 
                />

                <div className="flex-1 text-center md:text-left group relative">
                    <div className="flex items-center justify-center md:justify-start gap-3">
                        <h1 className="text-3xl font-bold">{channel.channelName}</h1>
                        {isOwner && (
                            <button 
                                onClick={openChannelEdit}
                                className="text-gray-400 hover:text-white transition-colors"
                                title="Edit Channel Info"
                            >
                                <FaPen size={14} />
                            </button>
                        )}
                    </div>
                    <p className="text-gray-400 mt-1">@{channel.channelName.replace(/\s+/g, '').toLowerCase()}</p>
                    <p className="text-gray-400 text-sm mt-1">{channel.subscribers} subscribers • {videos.length} videos</p>
                    <p className="text-gray-300 mt-3 max-w-2xl whitespace-pre-wrap">{channel.description}</p>
                </div>

                <div className="mt-4 md:mt-0">
                    {isOwner ? (
                        <div className="flex gap-3">
                            <button onClick={openCreateModal} className="bg-white text-black px-5 py-2 rounded-full font-semibold hover:bg-gray-200 flex items-center gap-2">
                                <FaUpload /> Upload
                            </button>
                            <button
                                onClick={() => setManageMode(!manageMode)}
                                className={`px-5 py-2 rounded-full font-semibold flex items-center gap-2 border ${manageMode ? "bg-gray-700 text-white" : "border-gray-600 text-gray-300"}`}
                            >
                                {manageMode ? <FaTimes /> : <FaEdit />}
                                {manageMode ? "Done" : "Manage"}
                            </button>
                        </div>
                    ) : (
                        <button className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200">Subscribe</button>
                    )}
                </div>
            </div>

            {/* --- VIDEO GRID --- */}
            <div className="p-4 md:p-12">
                <h2 className="text-xl font-bold mb-6">Videos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {videos.map((video) => (
                        <div key={video._id} className="relative group">
                            <VideoCard video={video} />
                            
                            {manageMode && (
                                <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center gap-4 z-10 backdrop-blur-sm">
                                    <button onClick={() => openEditModal(video)} className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transform hover:scale-110 transition-all">
                                        <FaEdit size={20} />
                                    </button>
                                    <button onClick={() => handleDeleteVideo(video._id)} className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transform hover:scale-110 transition-all">
                                        <FaTrash size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* --- MODAL 1: UPLOAD / EDIT VIDEO --- */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
                    <div className="bg-[#1F1F1F] p-6 rounded-xl w-full max-w-lg border border-gray-700 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                        <h2 className="text-xl font-bold mb-6">{isEditing ? "Edit Video" : "Upload Video"}</h2>
                        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                            <input name="title" value={videoData.title} placeholder="Video Title" onChange={handleChange} required className="w-full bg-[#0F0F0F] p-3 rounded-lg border border-gray-700 text-white" />
                            <textarea name="description" value={videoData.description} placeholder="Description" onChange={handleChange} required className="w-full bg-[#0F0F0F] p-3 rounded-lg border border-gray-700 text-white" />
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-400 font-bold uppercase">Thumbnail</label>
                                <input type="text" name="thumbnailUrl" value={videoData.thumbnailUrl} readOnly className="w-full bg-[#0F0F0F] p-2 rounded-lg border border-gray-700 text-gray-500 text-sm" placeholder="File URL will appear here" />
                                <input type="file" onChange={(e) => uploadFileHandler(e, 'thumbnailUrl')} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-400 font-bold uppercase">Video File</label>
                                <input type="text" name="videoUrl" value={videoData.videoUrl} readOnly className="w-full bg-[#0F0F0F] p-2 rounded-lg border border-gray-700 text-gray-500 text-sm" placeholder="File URL will appear here" />
                                <input type="file" accept="video/mp4,video/mkv" onChange={(e) => uploadFileHandler(e, 'videoUrl')} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer" />
                            </div>
                            {uploading && <p className="text-blue-400 text-sm animate-pulse text-center font-semibold">Uploading file to server... please wait...</p>}
                            <select name="category" value={videoData.category} onChange={handleChange} className="w-full bg-[#0F0F0F] p-3 rounded-lg border border-gray-700 text-white cursor-pointer">
                                <option value="Education">Education</option>
                                <option value="Gaming">Gaming</option>
                                <option value="Music">Music</option>
                                <option value="Movies">Movies</option>
                                <option value="News">News</option>
                                <option value="Live">Live</option>
                                <option value="Sports">Sports</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Tech">Tech</option>
                            </select>
                            <button type="submit" disabled={uploading} className={`w-full bg-blue-600 text-white py-3 rounded-lg font-bold uppercase tracking-wide mt-2 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}>
                                {isEditing ? "Update Video" : "Upload Video"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL 2: EDIT CHANNEL INFO --- */}
            {showChannelModal && (
                <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
                    <div className="bg-[#1F1F1F] p-6 rounded-xl w-full max-w-md border border-gray-700 relative">
                        <button onClick={() => setShowChannelModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                        <h2 className="text-xl font-bold mb-6">Edit Channel</h2>
                        <form onSubmit={handleChannelUpdate} className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">Channel Name</label>
                                <input type="text" value={channelData.channelName} onChange={(e) => setChannelData({...channelData, channelName: e.target.value})} className="w-full bg-[#0F0F0F] p-2 rounded-lg border border-gray-700 text-white" required />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">Description</label>
                                <textarea rows="4" value={channelData.description} onChange={(e) => setChannelData({...channelData, description: e.target.value})} className="w-full bg-[#0F0F0F] p-2 rounded-lg border border-gray-700 text-white resize-none" />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold mt-2 hover:bg-blue-700 transition-colors">
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Channel;