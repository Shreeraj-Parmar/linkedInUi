// src/context/SocketContext.js
import React, { createContext, useContext, useRef, useEffect } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const socketLinkURL = import.meta.env.VITE_SOCKET_LINK_URL;

  useEffect(() => {
    socket.current = io(socketLinkURL);

    socket.current.on("connect", () => {
      console.log("Socket connected with ID:", socket.current.id);
    });

    // Cleanup on unmount
    return () => {
      socket.current.disconnect();
      console.log("Socket disconnected");
    };
  }, [socketLinkURL]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
