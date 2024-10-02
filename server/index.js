import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotEnv from "dotenv";
import ConnectDB from "./Database/db.js";
import router from "./routes/route.js";
import http from "http"; // Import Node's http module
import { Server } from "socket.io"; // Import socket.io's Server class

const app = express();
app.use(cors());
dotEnv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

app.use("/", router);
const PORT = process.env.PORT;

// real time messaging with socket.io
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow requests from the client (React app)
    methods: ["GET", "POST"],
  },
});

let users = {}; // active users that shows online or offline

io.on("connection", (client) => {
  console.log("A User Connected: ", client.id);

  // online or offline
  client.on("register", (id) => {
    users[id] = { socketId: client.id, online: true };
    console.log("Registered user:", users); // Check if the user is registered
    io.emit("user_status", { userId: id, online: true });
  });

  // join a unique conversation room    // 1st join room
  client.on("join_conversation", (conversationId) => {
    client.join(conversationId); // join specific ID    // here room = conversationId
    console.log("user joined conversation : ", conversationId);
  });

  // Handle incoming messages from the client
  client.on("send_message", (data) => {
    const { conversationId, message } = data;
    console.log("recieved msg is", message);

    // Broadcast message to others in the conversation    // 2nd send msg in room
    io.to(conversationId).emit("receive_message", message);
  });
  // Send the list of currently online users to the new user
  client.emit("all_online_users", users);

  // Listen for user disconnect
  client.on("disconnect", () => {
    console.log("before remove.. users", users);
    // if offfline ==> remove from users object
    const userId = Object.keys(users).find(
      (id) => users[id].socketId === client.id
    );
    console.log("this is from socket", userId);
    if (userId) {
      users[userId].online = false; // Set user status to offline
      io.emit("user_status", { userId, online: false }); // Broadcast offline status
      console.log("User disconnected:", userId);
      console.log("after remove.. users", users);
    }
  });
});

ConnectDB(); // connect mongoDB

// server start
server.listen(PORT, () => {
  console.log(`server & socket server running on port: ${PORT}`);
});
