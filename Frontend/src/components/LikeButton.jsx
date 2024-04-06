import { useState, useEffect } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";

function LikeButton({ postId }) {
  const [likes, setLikes] = useState(0);
  const socket = socketIOClient("http://localhost:5000"); // Update the URL to match your server

  useEffect(() => {
    fetchLikes();

    // Listen for like updates from the server
    socket.on("likeUpdate", (data) => {
      if (data.postId === postId) {
        setLikes(data.likes);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchLikes = async () => {
    try {
      const response = await axios.post(`/api/posts/${postId}/like`);
      setLikes(response.data.likes);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  const handleLike = () => {
    // Emit event to server when user likes the post
    socket.emit("like", { postId });
  };

  return (
    <div>
      <button onClick={handleLike}>Like</button>
      <span>{likes} likes</span>
    </div>
  );
}

export default LikeButton;
