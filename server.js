const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./messages");
const { userJoin, getCurrentUser, userLeave } = require("./users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "client/build")));

const botName = "Chatbot";
const welcomeMsg = "Some awesome message about joining. Welcome to the chat!";

// Run when client connects
io.on("connection", (socket) => {
  // Join Room
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
