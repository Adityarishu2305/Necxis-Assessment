const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIO(server);

const posts = []; // Array to store posts

// API route to upload a new post
app.post("/api/posts", (req, res) => {
  const newPost = req.body;
  posts.push(newPost);
  io.emit("newPost", newPost); // Emit event to notify clients of new post
  res.status(201).json(newPost);
});

// API route to get all posts
app.get("/api/posts", (req, res) => {
  res.json(posts);
});

// API route to handle likes on a post
app.post("/api/posts/:postId/like", (req, res) => {
  const postId = req.params.postId;
  const postIndex = posts.findIndex((post) => post.id === postId);
  if (postIndex !== -1) {
    posts[postIndex].likes++;
    io.emit("likeUpdate", { postId, likes: posts[postIndex].likes }); // Emit event to notify clients of like update
    res.json({ likes: posts[postIndex].likes });
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

// API route to handle comments on a post
app.post("/api/posts/:postId/comments", (req, res) => {
  const postId = req.params.postId;
  const { text } = req.body;
  const postIndex = posts.findIndex((post) => post.id === postId);
  if (postIndex !== -1) {
    const newComment = { id: uuidv4(), text }; // Generate unique comment id using uuid library
    posts[postIndex].comments.push(newComment);
    io.emit("commentUpdate", { postId, comments: posts[postIndex].comments }); // Emit event to notify clients of comment update
    res.status(201).json(newComment);
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  // Listen for like events from clients
  socket.on("like", (data) => {
    const { postId } = data;
    const postIndex = posts.findIndex((post) => post.id === postId);
    if (postIndex !== -1) {
      posts[postIndex].likes++;
      io.emit("likeUpdate", { postId, likes: posts[postIndex].likes });
    }
  });

  // Listen for comment events from clients
  socket.on("comment", (data) => {
    const { postId, commentText } = data;
    const postIndex = posts.findIndex((post) => post.id === postId);
    if (postIndex !== -1) {
      const newComment = { id: uuidv4(), text: commentText };
      posts[postIndex].comments.push(newComment);
      io.emit("commentUpdate", { postId, comments: posts[postIndex].comments });
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
