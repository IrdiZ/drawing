const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

let move = {};
let pastMoves = [];

io.on("connection", (socket) => {
  console.log("a user connected");

  console.log("Giving connected user data");
  socket.emit("pastMoves", pastMoves);

  socket.on("move", (move) => {
    pastMoves.push(move);
    console.log("Added move");
    console.log("Moves right now: " + pastMoves.length);
    socket.broadcast.emit("pastMoves", pastMoves);
  });

  socket.on("clear", () => {
    pastMoves = [];
    socket.broadcast.emit("clear", true);
  });

  socket.on("undo", () => {
    pastMoves.pop();
    io.emit("clear", true);
    io.emit("pastMoves", pastMoves);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});
