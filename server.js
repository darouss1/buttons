const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 2022;
const app = express();

const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
  // User Connected to the App
  console.log(`${socket.id} Connected`);

  socket.on("join", ({ room }) => {
    // User Joins to the room
    socket.join(room);
  });

  socket.on("user-reacted", ({ emote, room }) => {
    // User Clicks on a reaction

    // Emit to Show the Reactions visible to all users in the room
    io.to(room).emit("show-reaction", { emote });
  });

  //  When user leaves the room
  socket.on("disconnect", () => {
    console.log(`${socket.id} Disconnected`);
  });
});

server.listen(PORT, () => {
  console.log(`Server Started on http://localhost:${PORT}`);
});
