import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios';
import VideoCard from '../components/VideoCard';
import { toast } from 'react-toastify';
// Import Icons: Upload (Cloud), Trash (Delete), Times (Close/Cancel), Edit (Pencil)
import { FaUpload, FaTrash, FaTimes, FaEdit } from 'react-icons/fa';

const Channel = () => {
    // 1. URL Params: Get the channel ID from the browser URL
    const { id } = useParams();

    // 2. Data State: Stores the channel info and the list of videos
    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get logged-in user from local storage (to check if they own this channel)
    const user = JSON.parse(localStorage.getItem('user'));

    // 3. UI State Management
    const [showModal, setShowModal] = useState(false);   // Toggles the Upload/Edit pop-up
    const [manageMode, setManageMode] = useState(false); // Toggles the "Edit/Delete" overlay on videos
    const [isEditing, setIsEditing] = useState(false);   // True = Update Mode, False = Create Mode
    const [editVideoId, setEditVideoId] = useState(null); // Stores ID of the video currently being edited

    // Form State: Holds input values for the modal
    const [videoData, setVideoData] = useState({
        title: "", description: "", thumbnailUrl: "", videoUrl: "", category: "Education"
    });

    // 4. Fetch Channel Data on Load
    useEffect(() => {
        const fetchChannel = async () => {
            try {
                const { data } = await axios.get(`/channels/${id}`);
                setChannel(data);
                setVideos(data.videos || []); // Backend returns full video objects, so we set them directly
            } catch (error) {
                console.error("Error fetching channel:", error);
                toast.error("Failed to load channel");
            } finally {
                setLoading(false); // Stop loading spinner regardless of success/failure
            }
        };
        fetchChannel();
    }, [id]);

    // --- ACTION HANDLERS ---

    // 5. Open Modal for CREATING a new video
    const openCreateModal = () => {
        setIsEditing(false); // Switch to "Create" mode
        // Clear form data so inputs are empty
        setVideoData({ title: "", description: "", thumbnailUrl: "", videoUrl: "", category: "Education" });
        setShowModal(true); // Show the modal
    };

    // 6. Open Modal for EDITING an existing video
    const openEditModal = (video) => {
        setIsEditing(true); // Switch to "Edit" mode
        setEditVideoId(video._id); // Save ID so we know which video to update
        // Pre-fill the form with the existing video details
        setVideoData({
            title: video.title,
            description: video.description,
            thumbnailUrl: video.thumbnailUrl,
            videoUrl: video.videoUrl,
            category: video.category
        });
        setShowModal(true);
    };

    // 7. Handle Form Submission (Works for both Create AND Edit)
    const handleFormSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        try {
            if (isEditing) {
                // --- UPDATE LOGIC (PUT Request) ---
                const { data } = await axios.put(`/videos/${editVideoId}`, videoData);
                toast.success("Video Updated!");

                // Update local state: Find the old video in the list and replace it with the new 'data'
                setVideos(videos.map(v => v._id === editVideoId ? data : v));
            } else {
                // --- CREATE LOGIC (POST Request) ---
                const { data } = await axios.post('/videos', videoData);
                toast.success("Video Uploaded!");

                // Update local state: Add the new video to the TOP of the list
                setVideos([data, ...videos]);
            }
            setShowModal(false); // Close modal on success
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation Failed");
        }
    };

    // 8. Handle Deleting a Video
    const handleDeleteVideo = async (videoId) => {
        if (!window.confirm("Are you sure you want to delete this video?")) return;

        try {
            await axios.delete(`/videos/${videoId}`);
            // Update local state: Filter out the deleted video so it disappears immediately
            setVideos((prev) => prev.filter(v => v._id !== videoId));
            toast.success("Video deleted");
        } catch (error) {
            toast.error("Failed to delete video");
        }
    };

    // Helper to update form state when user types
    const handleChange = (e) => {
        setVideoData({ ...videoData, [e.target.name]: e.target.value });
    };

    // 9. Conditional Rendering for Loading/Errors
    if (loading) return <div className="text-white text-center mt-20">Loading...</div>;
    if (!channel) return <div className="text-white text-center mt-20">Channel not found.</div>;

    // Check Ownership: Only show "Upload/Manage" buttons if logged-in user owns the channel
    const isOwner = user?._id === channel.owner;

    return (
        <div className="w-full min-h-screen bg-[#0F0F0F] text-white">

            {/* Banner Section */}
            <div className="w-full h-32 md:h-48 bg-gray-800">
                {channel.channelBanner && <img src={channel.channelBanner} alt="Banner" className="w-full h-full object-cover" />}
            </div>

            {/* Header Section: Avatar, Name, Stats */}
            <div className="px-4 md:px-12 py-6 flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-[#303030]">
                <img src={channel.owner?.avatar || `https://ui-avatars.com/api/?name=${channel.channelName}&background=random`} alt="Avatar" className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#0F0F0F] -mt-4 bg-gray-600" />

                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold">{channel.channelName}</h1>
                    <p className="text-gray-400 mt-1">@{channel.channelName.replace(/\s+/g, '').toLowerCase()}</p>
                    <p className="text-gray-400 text-sm mt-1">{channel.subscribers} subscribers • {videos.length} videos</p>
                </div>

                {/* Action Buttons (Visible only to Owner) */}
                <div className="mt-4 md:mt-0">
                    {isOwner ? (
                        <div className="flex gap-3">
                            {/* Upload Button */}
                            <button onClick={openCreateModal} className="bg-white text-black px-5 py-2 rounded-full font-semibold hover:bg-gray-200 flex items-center gap-2">
                                <FaUpload /> Upload
                            </button>
                            {/* Manage Toggle: Switches between View Mode and Edit/Delete Mode */}
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

            {/* Video Grid Section */}
            <div className="p-4 md:p-12">
                <h2 className="text-xl font-bold mb-6">Videos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {videos.map((video) => (
                        // Wrapper div needed for relative positioning of the Manage Overlay
                        <div key={video._id} className="relative group">
                            <VideoCard video={video} />

                            {/* MANAGE OVERLAY: Only visible if 'manageMode' is TRUE */}
                            {manageMode && (
                                <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center gap-4 z-10 backdrop-blur-sm">
                                    {/* EDIT BUTTON: Opens modal with pre-filled data */}
                                    <button
                                        onClick={() => openEditModal(video)}
                                        className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transform hover:scale-110 transition-all"
                                        title="Edit Video"
                                    >
                                        <FaEdit size={20} />
                                    </button>

                                    {/* DELETE BUTTON: Triggers delete logic */}
                                    <button
                                        onClick={() => handleDeleteVideo(video._id)}
                                        className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transform hover:scale-110 transition-all"
                                        title="Delete Video"
                                    >
                                        <FaTrash size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Reusable Modal (Used for both Creating and Editing) */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
                    <div className="bg-[#1F1F1F] p-6 rounded-xl w-full max-w-lg border border-gray-700 relative">
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>

                        {/* Dynamic Title based on mode */}
                        <h2 className="text-xl font-bold mb-6">{isEditing ? "Edit Video" : "Upload Video"}</h2>

                        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                            <input name="title" value={videoData.title} placeholder="Video Title" onChange={handleChange} required className="bg-[#0F0F0F] p-2 rounded border border-gray-700 text-white" />
                            <textarea name="description" value={videoData.description} placeholder="Description" onChange={handleChange} required className="bg-[#0F0F0F] p-2 rounded border border-gray-700 text-white" />
                            <input name="thumbnailUrl" value={videoData.thumbnailUrl} placeholder="Thumbnail URL" onChange={handleChange} required className="bg-[#0F0F0F] p-2 rounded border border-gray-700 text-white" />
                            <input name="videoUrl" value={videoData.videoUrl} placeholder="Video URL" onChange={handleChange} required className="bg-[#0F0F0F] p-2 rounded border border-gray-700 text-white" />
                            <select
                                name="category"
                                value={videoData.category}
                                onChange={handleChange}
                                className="bg-[#0F0F0F] p-2 rounded border border-gray-700 text-white"
                            >
                                {/* These must match Home.jsx categories exactly */}
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

                            {/* Submit Button Text changes based on mode */}
                            <button type="submit" className="bg-blue-600 text-white py-2 rounded font-semibold mt-2 hover:bg-blue-700">
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