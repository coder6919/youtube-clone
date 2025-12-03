import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa'; // Import icons

const CommentList = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const user = JSON.parse(localStorage.getItem('user'));
  
  // --- STATE FOR EDITING ---
  const [editingId, setEditingId] = useState(null); // ID of comment being edited
  const [editText, setEditText] = useState("");     // Text being typed during edit

  // 1. Fetch Comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(`/comments/${videoId}`);
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments", error);
      }
    };
    if (videoId) fetchComments();
  }, [videoId]);

  // 2. Add Comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data } = await axios.post('/comments', { videoId, text: newComment });
      setComments([data, ...comments]); // Backend now populates user info automatically
      setNewComment("");
      toast.success("Comment added!");
    } catch (error) {
      toast.error("Failed to add comment.");
    }
  };

  // 3. Delete Comment
  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await axios.delete(`/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch (error) {
      toast.error("Could not delete comment");
    }
  };

  // --- NEW: EDIT HANDLERS ---
  
  // Start Editing: Switch to input mode
  const startEditing = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  // Cancel Editing: Revert to view mode
  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  // Save Edit: Send PUT request
  const handleEditSubmit = async (commentId) => {
    if (!editText.trim()) return;

    try {
      // Optimistic UI Update: Update list immediately
      setComments(comments.map(c => 
        c._id === commentId ? { ...c, text: editText } : c
      ));
      
      setEditingId(null); // Exit edit mode
      
      // API Call
      await axios.put(`/comments/${commentId}`, { text: editText });
      toast.success("Comment updated");
    } catch (error) {
      toast.error("Failed to update comment");
      // Revert change if API fails (optional, usually fetch again)
    }
  };

  return (
    <div className="mt-6 w-full max-w-4xl">
      <h3 className="text-xl font-bold mb-4">{comments.length} Comments</h3>

      {/* Add Comment Input */}
      {user ? (
        <form onSubmit={handleAddComment} className="flex gap-4 mb-8">
          <img 
            src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`} 
            alt="User" 
            className="w-10 h-10 rounded-full object-cover" 
          />
          <div className="flex-1">
            <input 
              type="text" 
              placeholder="Add a comment..." 
              className="w-full bg-transparent border-b border-gray-700 focus:border-white outline-none pb-1 text-sm text-white transition-colors"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="flex justify-end mt-2">
                <button type="submit" className="bg-[#3ea6ff] text-black px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#65b8ff] transition-colors">
                    Comment
                </button>
            </div>
          </div>
        </form>
      ) : (
        <p className="mb-6 text-gray-400 text-sm">Please <a href="/login" className="text-blue-400 hover:underline">sign in</a> to comment.</p>
      )}

      {/* Comments List */}
      <div className="flex flex-col gap-6">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-4">
            {/* Avatar */}
            <img 
              src={comment.userId?.avatar || `https://ui-avatars.com/api/?name=${comment.userId?.username || 'User'}&background=random`} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full object-cover bg-gray-600"
            />
            
            <div className="flex flex-col gap-1 w-full">
              {/* Header: Name + Date */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">
                    @{comment.userId?.username || "Unknown"}
                </span>
                <span className="text-xs text-gray-400">
                    {new Date(comment.timestamp).toLocaleDateString()}
                </span>
              </div>
              
              {/* --- EDIT MODE VS VIEW MODE --- */}
              {editingId === comment._id ? (
                // EDIT MODE: Show Input + Save/Cancel
                <div className="flex flex-col gap-2 mt-1">
                    <input 
                        type="text" 
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="bg-[#121212] border-b border-white outline-none text-white p-1 text-sm w-full"
                        autoFocus
                    />
                    <div className="flex gap-2 justify-end">
                        <button onClick={cancelEditing} className="text-xs uppercase font-medium text-gray-400 hover:text-white">Cancel</button>
                        <button onClick={() => handleEditSubmit(comment._id)} className="text-xs uppercase font-medium text-blue-400 hover:text-blue-300 disabled:text-gray-600">Save</button>
                    </div>
                </div>
              ) : (
                // VIEW MODE: Show Text
                <p className="text-sm text-gray-200">{comment.text}</p>
              )}
              
              {/* --- ACTIONS (Edit/Delete) - Only if Owner --- */}
              {user?._id === comment.userId?._id && !editingId && (
                <div className="flex gap-4 mt-1">
                    <button 
                      onClick={() => startEditing(comment)}
                      className="text-xs text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(comment._id)}
                      className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 cursor-pointer"
                    >
                      <FaTrash /> Delete
                    </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentList;