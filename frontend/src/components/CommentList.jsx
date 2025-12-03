import React, { useEffect, useState } from 'react';
import axios from '../utils/axios'; // Use our configured axios
import { toast } from 'react-toastify';

const CommentList = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const user = JSON.parse(localStorage.getItem('user')); // Get logged-in user

  // 1. Fetch comments when videoId changes
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

  // 2. Handle Adding a Comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data } = await axios.post('/comments', { videoId, text: newComment });
      setComments([data, ...comments]); // Add new comment to top of list
      setNewComment(""); // Clear input
      toast.success("Comment added!");
    } catch (error) {
      toast.error("Failed to add comment. Please login.");
    }
  };

  // 3. Handle Deleting a Comment
  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`/comments/${commentId}`);
      // Filter out the deleted comment from the state
      setComments(comments.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch (error) {
      toast.error("Could not delete comment");
    }
  };

  return (
    <div className="mt-6 w-full max-w-4xl">
      <h3 className="text-xl font-bold mb-4">{comments.length} Comments</h3>

      {/* Add Comment Input */}
      {user ? (
        <form onSubmit={handleAddComment} className="flex gap-4 mb-8">
          <img 
            src={user.avatar || "https://via.placeholder.com/40"} 
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
                <button type="submit" className="bg-[#3ea6ff] text-black px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#65b8ff] transition-colors cursor-pointer">
                    Comment
                </button>
            </div>
          </div>
        </form>
      ) : (
        <p className="mb-6 text-gray-400 text-sm">Please <a href="/login" className="text-blue-400 hover:underline">sign in</a> to comment.</p>
      )}

      {/* Comments List Display */}
      <div className="flex flex-col gap-6">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-4">
            <img 
              src={comment.userId?.avatar || "https://via.placeholder.com/40"} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full object-cover bg-gray-600"
              onError={(e) => e.target.src = "https://ui-avatars.com/api/?name=User&background=random"}
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
              
              <p className="text-sm text-gray-200">{comment.text}</p>
              
              {/* Delete Button (Only visible if user owns the comment) */}
              {user?._id === comment.userId?._id && (
                <button 
                  onClick={() => handleDelete(comment._id)}
                  className="text-xs text-red-500 hover:text-red-400 mt-1 w-fit cursor-pointer font-medium uppercase"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentList;