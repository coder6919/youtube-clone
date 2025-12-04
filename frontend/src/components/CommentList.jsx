import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa'; 
import { Link } from 'react-router-dom'; // I am importing Link to fix the broken navigation on mobile

const CommentList = ({ videoId }) => {
  // I initialize state to hold the list of comments and the new comment input
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  
  // I retrieve the user from local storage to check if they are logged in
  const user = JSON.parse(localStorage.getItem('user'));
  
  // I manage state for the editing feature: tracking which comment is being edited and the temporary text
  const [editingId, setEditingId] = useState(null); 
  const [editText, setEditText] = useState("");     

  // I fetch the comments from the API whenever the videoId changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(`/comments/${videoId}`);
        setComments(data);
      } catch (error) {
        // I log any errors that occur during fetching
        console.error("Error fetching comments", error);
      }
    };
    if (videoId) fetchComments();
  }, [videoId]);

  // I handle the submission of a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    // I prevent submitting empty comments
    if (!newComment.trim()) return;

    try {
      // I send the new comment to the backend
      const { data } = await axios.post('/comments', { videoId, text: newComment });
      // I update the local state immediately with the new comment returned from the server
      setComments([data, ...comments]); 
      setNewComment("");
      toast.success("Comment added!");
    } catch (error) {
      toast.error("Failed to add comment.");
    }
  };

  // I handle the deletion of a comment
  const handleDelete = async (commentId) => {
    // I ask for confirmation before deleting to prevent accidental clicks
    if (!window.confirm("Delete this comment?")) return;
    try {
      await axios.delete(`/comments/${commentId}`);
      // I remove the deleted comment from the local state to update the UI instantly
      setComments(comments.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch (error) {
      toast.error("Could not delete comment");
    }
  };

  // I set the state to start editing a specific comment
  const startEditing = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  // I cancel the editing process and reset the state
  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  // I submit the edited comment to the backend
  const handleEditSubmit = async (commentId) => {
    if (!editText.trim()) return;

    try {
      // I perform an optimistic UI update so the user sees the change immediately
      setComments(comments.map(c => 
        c._id === commentId ? { ...c, text: editText } : c
      ));
      
      setEditingId(null); // I exit edit mode
      
      // I send the update request to the API
      await axios.put(`/comments/${commentId}`, { text: editText });
      toast.success("Comment updated");
    } catch (error) {
      toast.error("Failed to update comment");
    }
  };

  return (
    <div className="mt-6 w-full max-w-4xl">
      <h3 className="text-xl font-bold mb-4">{comments.length} Comments</h3>

      {/* I check if the user is logged in before showing the comment input form */}
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
        // I use the Link component here to ensure proper navigation to the login page without reloading
        <p className="mb-6 text-gray-400 text-sm">
            Please <Link to="/login" className="text-blue-400 hover:underline">sign in</Link> to comment.
        </p>
      )}

      {/* I map through the comments array to display each comment */}
      <div className="flex flex-col gap-6">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-4">
            <img 
              src={comment.userId?.avatar || `https://ui-avatars.com/api/?name=${comment.userId?.username || 'User'}&background=random`} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full object-cover bg-gray-600"
            />
            
            <div className="flex flex-col gap-1 w-full">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">
                    @{comment.userId?.username || "Unknown"}
                </span>
                <span className="text-xs text-gray-400">
                    {new Date(comment.timestamp).toLocaleDateString()}
                </span>
              </div>
              
              {/* I check if this specific comment is being edited to toggle between view and edit modes */}
              {editingId === comment._id ? (
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
                <p className="text-sm text-gray-200">{comment.text}</p>
              )}
              
              {/* I show edit/delete buttons only if the logged-in user is the owner of the comment */}
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