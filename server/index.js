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

let users = []; // active users that shows online or offline

io.on("connection", (client) => {
  console.log("A User Connected: ", client.id);

  // online or offline
  client.on("register", (id) => {
    let newUser = {
      socketId: client.id,
      userId: id,
    };

    // Check if the user already exists based on userId
    if (!users.some((user) => user.userId === id)) {
      users.push(newUser);
      io.emit("online_users", users);
    }

    console.log("All users are:", users);
  });

  io.emit("online_users", users);
  // join a unique conversation room    // 1st join room
  client.on("join_conversation", (conversationId) => {
    client.join(conversationId); // join specific ID    // here room = conversationId
    console.log("user joined conversation :  ", conversationId);
  });

  client.on("remove_user", (id) => {
    let user = users.find((user) => user.userId === id);
    if (user) {
      users = users.filter((user) => user.userId !== id);
      io.emit("online_users", users);
    }
  });

  // Send the list of currently online users to the new user

  // Listen for user disconnect
  client.on("disconnect", () => {
    let user = users.find((user) => user.socketId === client.id);
    if (user) {
      users = users.filter((user) => user.socketId !== client.id);
      console.log("User Disconnected: ", client.id);
      console.log("final users arr", users);
      io.emit("online_users", users);
    }
  });
});

ConnectDB(); // connect mongoDB

// server start
server.listen(PORT, () => {
  console.log(`server & socket server running on port: ${PORT}`);
});

export { io };
