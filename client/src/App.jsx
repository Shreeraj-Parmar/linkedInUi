import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// Context:
import UserContext from "./context/UserContext";
// import { SocketProvider } from "./context/SocketContext";
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

function App() {
  const UserRouter = createBrowserRouter([
    {
      path: "/",
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
      path: "/social",
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

  return (
    <>
      <UserContext>
        {/* <SocketProvider> */}
        <CheckInternet />
        <RouterProvider router={UserRouter} />
        {/* </SocketProvider> */}
      </UserContext>
    </>
  );
}

export default App;
