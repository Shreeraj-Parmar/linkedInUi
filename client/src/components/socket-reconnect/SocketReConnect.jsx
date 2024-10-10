import React from "react";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socketLinkURL = import.meta.env.VITE_SOCKET_LINK_URL;

const SocketReConnect = () => {
  const [onlineUsers, setOnlineUsers] = useState({});

  const socket = useRef();
  useEffect(() => {
    if (!window.socketClient) {
      socket.current = io(socketLinkURL);
      console.log("Socket URL:", socketLinkURL);

      socket.current.on("connect", () => {
        console.log("Socket Re-connected with ID:", socket.current.id);
      });

      socket.current.on("all_online_users", (onlineUsers) => {
        setOnlineUsers(onlineUsers); // Set all currently online users in state
        window.onlineUsers = onlineUsers;
      });

      socket.current.on("user_status", ({ userId, online }) => {
        console.log(`userid: ${userId} is ${online}`);
        setOnlineUsers((prev) => ({
          ...prev,
          [userId]: online,
        }));
        window.onlineUsers = onlineUsers;
      });

      window.socketClient = socket.current;
    }
    return () => {
      socket.current.disconnect();
    };
  }, []);
  return <></>;
};

export default SocketReConnect;
