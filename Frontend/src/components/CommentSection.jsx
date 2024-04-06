import { useState, useEffect } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const socket = socketIOClient("http://localhost:5000"); // Update the URL to match your server

  useEffect(() => {
    fetchComments();

    // Listen for comment updates from the server
    socket.on("commentUpdate", (data) => {
      if (data.postId === postId) {
        setComments(data.comments);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/posts/${postId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async () => {
    try {
      // Send new comment to server
      await axios.post(`/api/posts/${postId}/comments`, { text: newComment });
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleChange = (event) => {
    setNewComment(event.target.value);
  };

  return (
    <div>
      <h3>Comments</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>{comment.text}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newComment}
        onChange={handleChange}
        placeholder="Add a comment"
      />
      <button onClick={handleAddComment}>Comment</button>
    </div>
  );
}

export default CommentSection;
