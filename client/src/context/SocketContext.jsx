// SocketContext.js
import React, { createContext, useRef, useEffect } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const socket = useRef();

  // Initialize socket connection
  useEffect(() => {
    const socketLinkURL = import.meta.env.VITE_SOCKET_LINK_URL;
    socket.current = io(socketLinkURL);

    socket.current.on("connect", () => {
      console.log("Socket connected with ID:", socket.current.id);
    });

    console.log("Socket URL:", socketLinkURL);

    // Cleanup when component unmounts
    return () => {
      socket.current.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
