import React, { useEffect, useRef, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// Context:
import UserContext from "./context/UserContext";
//components:
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Lists from "./components/Lists";
import Overview from "./components/social/Overview";
// experiments compo
import FormValidation from "./components/Experiments/FormValidation";

import "./App.css";
import ViewProfile from "./components/social/ViewProfile";
// import UserProfile from "./components/All ShowList/UserProfile";
import MyNetwork from "./components/social/main-menu compo/MyNetwork";
import Connections from "./components/social/main-menu compo/my network compo/Connections";
import FollowAndFollowing from "./components/social/main-menu compo/my network compo/FollowAndFollowing";
import UserProfile from "./components/social/UserProfile";
import Message from "./components/Message/Message";
import CheckInternet from "./components/Internet/CheckInternet";
import Notifications from "./components/Notifications/Notifications";

// import { io } from "socket.io-client";
// const socketLinkURL = import.meta.env.VITE_SOCKET_LINK_URL;

function App() {
  const UserRouter = createBrowserRouter([
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/lists",
      element: <Lists />,
    },
    {
      path: "/exe",
      element: <FormValidation />,
    },
    {
      path: "/",
      element: <Overview />,
    },
    {
      path: "/profile",
      element: <ViewProfile />,
    },

    {
      path: "/my-network",
      element: <MyNetwork />,
    },
    {
      path: "/my-network/connection",
      element: <Connections />,
    },
    {
      path: "/my-network/follow",
      element: <FollowAndFollowing />,
    },
    {
      path: "/user/:userId",
      element: <UserProfile />,
    },
    {
      path: "/message",
      element: <Message />,
    },
    {
      path: "/notification",
      element: <Notifications />,
    },
  ]);

  //socket io config
  // const socket = useRef();

  // useEffect(() => {
  //   socket.current = io(socketLinkURL);
  //   console.log("Socket URL:", socketLinkURL);

  //   socket.current.on("connect", () => {
  //     console.log("Socket connected with ID:", socket.current.id);
  //   });

  //   window.socketClient = socket.current;

  //   return () => {
  //     socket.current.disconnect();
  //   };
  // }, []);

  return (
    <>
      <UserContext>
        <CheckInternet />
        <RouterProvider router={UserRouter} />
      </UserContext>
    </>
  );
}

export default App;
