import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// Context:
import UserContext from "./context/UserContext";
//components:
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Lists from "./components/Lists";
import Overview from "./components/social/Overview";
// experiments compo
import JobOverview from "./components/social/job/JobOverview";
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
import Business from "./components/social/business/Business";
import NewCompany from "./components/social/business/company/NewCompany";
import CompanyOverView from "./components/social/business/company/CompanyOverView";
import { verifyTokenFunc } from "./utils/token-verification-func.js";
import ViewCompany from "./components/social/business/company/ViewCompany.jsx";
import CreateJob from "./components/social/job/CreateJob.jsx";
import JobView from "./components/social/job/JobView.jsx";
import EditJob from "./components/social/job/EditJob.jsx";
import PremiumView from "./components/social/business/PremiumView.jsx";

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

    {
      path: "/business",
      element: <Business />,
    },
    {
      path: "/company/new",
      element: <NewCompany />,
    },
    {
      path: "/company/:companyId/admin",
      element: <CompanyOverView />,
    },
    {
      path: "/company/:companyId",
      element: <ViewCompany />,
    },
    {
      path: "/job/new",
      element: <CreateJob />,
    },
    {
      path: "/jobs",
      element: <JobOverview />,
    },
    {
      path: "/job/view/:jobId",
      element: <JobView />,
    },
    {
      path: "/job/edit/:jobId",
      element: <EditJob />,
    },
    {
      path: "/premium",
      element: <PremiumView />,
    },
  ]);

  //socket io config
  // const socket = useRef();

  useLayoutEffect(() => {
    let windowPath = window.location.pathname;
    if (
      windowPath === "/login" ||
      windowPath === "/signup" ||
      windowPath === "/" ||
      windowPath === "/exe" ||
      windowPath === "/user/:userId" ||
      windowPath === "/company/:companyId"
    ) {
      return;
    } else {
      verifyTokenFunc();
    }
  }, []);

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
