import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios';
import VideoCard from '../components/VideoCard';
import { toast } from 'react-toastify';
// Import Icons: Upload (Cloud), Trash (Delete), Times (Close), Edit (Pencil), Camera (Banner)
import { FaUpload, FaTrash, FaTimes, FaEdit, FaCamera } from 'react-icons/fa';

const Channel = () => {
    // 1. URL Params: Get the channel ID from the browser URL
    const { id } = useParams();

    // 2. Data State: Stores channel info and list of videos
    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get logged-in user to check ownership
    const user = JSON.parse(localStorage.getItem('user'));

    // 3. UI State Management
    const [showModal, setShowModal] = useState(false);   // Toggles Upload/Edit pop-up
    const [manageMode, setManageMode] = useState(false); // Toggles "Edit/Delete" overlay
    const [isEditing, setIsEditing] = useState(false);   // True = Update, False = Create
    const [editVideoId, setEditVideoId] = useState(null); // Stores ID of video being edited
    const [uploading, setUploading] = useState(false);   // Track if a file is currently uploading

    // Form State: Holds values for the modal inputs
    const [videoData, setVideoData] = useState({
        title: "", description: "", thumbnailUrl: "", videoUrl: "", category: "Education"
    });

    // 4. Fetch Channel Data on Load
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

    // --- ACTION HANDLERS ---

    // 5. File Upload Handler (Video & Thumbnail)
    // Uploads file to backend 'uploads' folder and sets the returned URL to state
    const uploadFileHandler = async (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;

        // Create FormData object to send file as 'multipart/form-data'
        const formData = new FormData();
        formData.append('file', file);

        setUploading(true); // Start loading spinner

        try {
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' },
            };

            // Call Backend Upload Route
            const { data } = await axios.post('/upload', formData, config);

            // Update state with the returned file path (prepending server URL)
            setVideoData({ ...videoData, [fieldName]: data });
            setUploading(false); // Stop loading spinner
        } catch (error) {
            console.error(error);
            setUploading(false);
            toast.error("File upload failed");
        }
    };

    // 6. Banner Upload Handler
    // Specific handler to update the channel banner image
    const handleBannerUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Upload file to server
            const { data: filePath } = await axios.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            //Cloudinary returns the full URL, so we DO NOT add localhost
            const fullUrl = filePath;

            // Update Channel in Database (Permanent Save)
            await axios.put(`/channels/${id}`, { channelBanner: fullUrl });

            // Update UI immediately
            setChannel(prev => ({ ...prev, channelBanner: fullUrl }));
            toast.success("Banner updated successfully!");

        } catch (error) {
            toast.error("Failed to update banner");
        }
    };

    // 7. Open Modal Handlers
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

    // 8. Handle Form Submit (Create OR Update)
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                // Update existing video
                const { data } = await axios.put(`/videos/${editVideoId}`, videoData);
                toast.success("Video Updated!");
                // Update video in local list
                setVideos(videos.map(v => v._id === editVideoId ? data : v));
            } else {
                // Create new video
                const { data } = await axios.post('/videos', videoData);
                toast.success("Video Uploaded!");
                // Add new video to list
                setVideos([data, ...videos]);
            }
            setShowModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation Failed");
        }
    };

    // 9. Handle Delete Video
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

    // Helper for text inputs
    const handleChange = (e) => {
        setVideoData({ ...videoData, [e.target.name]: e.target.value });
    };

    // Loading/Error Checks
    if (loading) return <div className="text-white text-center mt-20">Loading...</div>;
    if (!channel) return <div className="text-white text-center mt-20">Channel not found.</div>;

    const isOwner = user?._id === channel.owner;

    return (
        <div className="w-full min-h-screen bg-[#0F0F0F] text-white">

            {/* --- BANNER SECTION --- */}
            <div className="w-full h-32 md:h-48 bg-gray-800 relative group">
                {/* Display Banner Image */}
                {channel.channelBanner ? (
                    <img src={channel.channelBanner} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">No Banner</div>
                )}

                {/* Edit Banner Overlay (Only for Owner) */}
                {isOwner && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                        <label className="cursor-pointer flex flex-col items-center gap-2 text-white font-bold">
                            <FaCamera size={24} />
                            <span>Change Banner</span>
                            {/* Hidden File Input for Banner */}
                            <input type="file" className="hidden" onChange={handleBannerUpload} />
                        </label>
                    </div>
                )}
            </div>

            {/* --- HEADER SECTION --- */}
            <div className="px-4 md:px-12 py-6 flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-[#303030]">
                {/* Avatar with fallback */}
                <img
                    src={channel.owner?.avatar || `https://ui-avatars.com/api/?name=${channel.channelName}&background=random`}
                    alt="Avatar"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#0F0F0F] -mt-4 bg-gray-600 object-cover"
                />

                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold">{channel.channelName}</h1>
                    <p className="text-gray-400 mt-1">@{channel.channelName.replace(/\s+/g, '').toLowerCase()}</p>
                    <p className="text-gray-400 text-sm mt-1">{channel.subscribers} subscribers • {videos.length} videos</p>
                    <p className="text-gray-300 mt-3 max-w-2xl whitespace-pre-wrap">{channel.description}</p>
                </div>

                {/* Actions (Upload/Manage for Owner) */}
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
                                {manageMode ? "Done Managing" : "Manage Videos"}
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

                            {/* Manage Overlay (Edit/Delete Buttons) */}
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

            {/* --- REUSABLE MODAL (Create & Edit) --- */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
                    <div className="bg-[#1F1F1F] p-6 rounded-xl w-full max-w-lg border border-gray-700 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>

                        <h2 className="text-xl font-bold mb-6">{isEditing ? "Edit Video" : "Upload Video"}</h2>

                        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                            <input
                                name="title"
                                value={videoData.title}
                                placeholder="Video Title"
                                onChange={handleChange}
                                required
                                className="bg-[#0F0F0F] p-2 rounded border border-gray-700 text-white"
                            />
                            <textarea
                                name="description"
                                value={videoData.description}
                                placeholder="Description"
                                onChange={handleChange}
                                required
                                className="bg-[#0F0F0F] p-2 rounded border border-gray-700 text-white"
                            />

                            {/* --- THUMBNAIL UPLOAD SECTION --- */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-gray-400">Thumbnail</label>
                                {/* Read-only input shows the URL after upload */}
                                <input
                                    type="text"
                                    name="thumbnailUrl"
                                    value={videoData.thumbnailUrl}
                                    readOnly
                                    className="bg-[#0F0F0F] p-2 rounded border border-gray-700 text-gray-500 text-sm mb-1"
                                    placeholder="File URL will appear here"
                                />
                                {/* File input triggers the upload handler */}
                                <input
                                    type="file"
                                    onChange={(e) => uploadFileHandler(e, 'thumbnailUrl')}
                                    className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer"
                                />
                            </div>

                            {/* --- VIDEO UPLOAD SECTION --- */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-gray-400">Video File</label>
                                <input
                                    type="text"
                                    name="videoUrl"
                                    value={videoData.videoUrl}
                                    readOnly
                                    className="bg-[#0F0F0F] p-2 rounded border border-gray-700 text-gray-500 text-sm mb-1"
                                    placeholder="File URL will appear here"
                                />
                                <input
                                    type="file"
                                    accept="video/mp4,video/mkv" // Limit accepted types
                                    onChange={(e) => uploadFileHandler(e, 'videoUrl')}
                                    className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer"
                                />
                            </div>

                            {/* Loading Indicator */}
                            {uploading && <p className="text-blue-400 text-sm animate-pulse text-center">Uploading file to server... please wait...</p>}

                            {/* Category Select */}
                            <select
                                name="category"
                                value={videoData.category}
                                onChange={handleChange}
                                className="bg-[#0F0F0F] p-2 rounded border border-gray-700 text-white"
                            >
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

                            <button
                                type="submit"
                                disabled={uploading} // Disable button while uploading
                                className={`bg-blue-600 text-white py-2 rounded font-semibold mt-2 ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                            >
                                {isEditing ? "Update Video" : "Upload Video"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Channel;