const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const mysql = require("mysql");
const { Server } = require("socket.io");

app.use(cors());
const server = http.createServer(app);

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "livechat",
  port: 3308,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL Server!");
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    method: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  //   socket.on("join_room", (data) => {
  //     socket.join(data);
  //   });

  socket.on("join_room", (roomName) => {
    let split = roomName.split("--with--"); // ['username2', 'username1']

    let unique = [...new Set(split)].sort((a, b) => (a < b ? -1 : 1)); // ['username1', 'username2']

    let updatedRoomName = `${unique[0]}--with--${unique[1]}`; // 'username1--with--username2'

    Array.from(socket.rooms)
      .filter((it) => it !== socket.id)
      .forEach((id) => {
        socket.leave(id);
        socket.removeAllListeners(`emitMessage`);
      });

    socket.join(updatedRoomName);

    socket.on(`send_message`, (data) => {
      Array.from(socket.rooms)
        .filter((it) => it !== socket.id)
        .forEach((id) => {
          socket.to(id).emit("receive_message", data);
        });

      db.query(
        "INSERT INTO messages (sender, receiver, message) VALUES ('" +
          data.sender +
          "', '" +
          data.receiver +
          "', '" +
          data.message +
          "')",
        function (error, result) {
          // console.log(error);
          //
        }
      );
    });
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// enable URL encoded for POST requests
app.use(express.json({ type: ["application/json", "application/csp-report"] }));

// enable headers required for POST request
app.use(function (request, result, next) {
  result.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// create api to return all messages
app.post("/get_messages", function (request, result) {
  // get all messages from database
  db.query(
    "SELECT sender,receiver,send_at as time,message FROM messages WHERE (sender = '" +
      request.body.sender +
      "' AND receiver = '" +
      request.body.receiver +
      "') OR (sender = '" +
      request.body.receiver +
      "' AND receiver = '" +
      request.body.sender +
      "')",
    function (error, messages) {
      // response will be in JSON
      result.end(JSON.stringify(messages));
    }
  );
});

server.listen(3001, () => {
  console.log("server running");
});
