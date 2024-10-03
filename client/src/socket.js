// src/socket.js
import { io } from "socket.io-client";

const socketLinkURL = import.meta.env.VITE_SOCKET_LINK_URL;

const socket = io(socketLinkURL);

socket.on("connect", () => {
  console.log("Socket connected with ID:", socket.id);
});

console.log("Socket URL:", socketLinkURL);

export default socket;
