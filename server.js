const path = require("path");
const http = require("http");
const express = require("express");
const moment = require("moment");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "client/build")));

const users = [];
const botName = "Chatbot";
const welcomeMsg = "Some awesome message about joining. Welcome to the chat!";

// Join chat
const userJoin = (id, username, chatId) => {
  const user = { id, username, chatId };
  users.push(user);
  return user;
};

// Get current user
const getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

// User leaves chat
const userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// Format chat messages
const formatMessage = (username, text) => {
  return {
    username,
    text,
    time: moment().format("MMM Do, h:mm:ss a"),
  };
};

// Run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, chatId }) => {
    const user = userJoin(socket.id, username, chatId);
    socket.join(user.chatId);

    // Welcome current user
    socket.emit("message", formatMessage(botName, welcomeMsg));

    // TODO: Broadcast when a user connects
    // causing useEffect to fire repeatedly
    // socket.broadcast
    //   .to(user.chatId)
    //   .emit(
    //     "message",
    //     formatMessage(botName, `${user.username} has joined the chat`)
    //   );
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.chatId).emit("message", formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.chatId).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );
    }
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
