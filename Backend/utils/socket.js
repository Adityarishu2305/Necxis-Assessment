const socketIO = require("socket.io");

module.exports = function (server) {
  const io = socketIO(server);

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });

    // Listen for events related to post likes and comments
    socket.on("likeUpdate", (data) => {
      // Broadcast the like update to all connected clients
      io.emit("likeUpdate", data);
    });

    socket.on("commentUpdate", (data) => {
      // Broadcast the comment update to all connected clients
      io.emit("commentUpdate", data);
    });
  });
};
