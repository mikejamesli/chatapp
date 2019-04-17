const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/build"));
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const redis = require("socket.io-redis");
const users = require("./users");
io.adapter(redis({ host: "localhost", port: 6379 }));

io.on("connection", function(socket) {

  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  socket.on("chat", function(data) {
    console.log("message: " + data.message);
    const message = {
      user_id: "1234",
      message: data.message
    };

    io.emit("chat", message);
  });
});

app.get("/user/:id", (req, res) => {
  const userId = Number(req.params.id);
  const profile = users.find(x => x.id === userId);
  res.send(profile);
});
app.post("/channel/square/messages", (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`
  );
});

server.listen(5001, () => {
  console.log("Backend Server is running on http://localhost:5001");
});
