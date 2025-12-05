import React, { useState } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// --- REDUX IMPORTS ---
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../redux/userSlice';

const CreateChannel = () => {
  const [formData, setFormData] = useState({ channelName: '', description: '' });
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  // --- REDUX STATE & DISPATCH ---
  const { currentUser } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Call API to create channel
      const { data } = await axios.post('/channels', formData);

      // 2. REDUX ACTION: Update user state with the new channel
      // We dispatch the action so the store (and localStorage) is updated automatically
      dispatch(updateUser({ channels: [data._id] }));

      toast.success("Channel Created Successfully!");
      navigate(`/channel/${data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create channel");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F] text-white p-4">
      <div className="bg-[#1F1F1F] p-8 rounded-xl w-full max-w-md border border-gray-800 shadow-xl">
        <h1 className="text-2xl font-bold mb-2">How you'll appear</h1>
        <p className="text-gray-400 mb-6 text-sm">Create your channel to start uploading videos.</p>

        <div className="flex justify-center mb-6">
          {/* Using currentUser from Redux */}
          <img
            src={currentUser?.avatar || "https://via.placeholder.com/100"}
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-[#0F0F0F] bg-gray-600"
          />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Channel Name</label>
            <input
              type="text"
              name="channelName"
              placeholder="e.g. Code with John"
              onChange={handleChange}
              required
              className="w-full bg-[#0F0F0F] border border-gray-700 p-3 rounded-lg focus:border-blue-500 outline-none text-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <textarea
              name="description"
              placeholder="Tell viewers about your channel..."
              onChange={handleChange}
              rows="4"
              className="w-full bg-[#0F0F0F] border border-gray-700 p-3 rounded-lg focus:border-blue-500 outline-none text-white transition-colors resize-none"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 py-2 rounded-full font-medium text-blue-400 hover:bg-blue-400/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              Create Channel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChannel;