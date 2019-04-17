const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/build"));
const server = require("http").createServer(app);
const io = require("socket.io")(server);

io.on("connection", function(socket) {
  console.log("user connected");

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


// const Redis = require("ioredis");

// const redis = new Redis();

// redis.on("message", (channel, message) => {
//   console.log(`Received the following message from ${channel}: ${message}`);
// });

// const channel = "square";

// redis.subscribe(channel, (error, count) => {
//   if (error) {
//     throw new Error(error);
//   }
//   console.log(
//     `Subscribed to ${count} channel. Listening for updates on the ${channel} channel.`
//   );
// });

// const pub = new Redis();

// const sleep = sec => new Promise(resolve => setTimeout(resolve, sec * 1000));

// async function main() {
//   console.log("Started square publisher...");
//   // Sleep 4 seconds and then publish square "opened" event.
//   await sleep(4);
//   pub.publish(channel, "opened");

//   await sleep(7);
//   pub.publish(channel, "closed");
//   pub.disconnect();
// }

// main();


app.get("/user/1", (req, res) => {
  res.send({
    id: 1234,
    username: "Alfredo",
    avatar: "https://api.adorable.io/avatars/200/Alfredo.png",
    bio:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras urna ante, sollicitudin sed placerat a, sagittis sit amet sem. Proin in euismod urna, vel vestibulum nibh. Integer dictum velit non."
  });
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
