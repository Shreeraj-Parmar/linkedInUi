// import { useState } from "react";
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
import UserProfile from "./components/All ShowList/UserProfile";
import MyNetwork from "./components/social/main-menu compo/MyNetwork";
import Connections from "./components/social/main-menu compo/my network compo/Connections";
import FollowAndFollowing from "./components/social/main-menu compo/my network compo/FollowAndFollowing";

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
      path: "/admin/user/profile/:userId",
      element: <UserProfile />,
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
  ]);
  return (
    <>
      <UserContext>
        <RouterProvider router={UserRouter} />
      </UserContext>
    </>
  );
}

export default App;
