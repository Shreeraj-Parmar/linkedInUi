import React, { useEffect, useState, useContext } from "react";
import { AllContext } from "../../../../context/UserContext";
import Badge from "@mui/material/Badge";
import {
  getAllUnreadMsg,
  getUnreadApplicantAccCompanyId,
} from "../../../../services/api.js";

const CompanyMenu = ({
  setCompanyMenu,
  companyMenu,
  setEditCompanyDialog,
  companyId,
}) => {
  const [unreadMSGCount, setMSGUnreadCount] = useState(0);
  const [unreadApplicantCount, setUnreadApplicantCount] = useState(0);
  const { socket, messages } = useContext(AllContext);

  const getAllUnreadMessagesFunc = async () => {
    let res = await getAllUnreadMsg({
      reqId: companyId && companyId.companyId,
      reqIdType: "Company",
    });
    res.status === 200 && console.log(res.data);
    res.status === 200 && setMSGUnreadCount(res.data);
  };

  const getUnreadApplicantFromServer = async () => {
    let res = await getUnreadApplicantAccCompanyId({
      companyId: companyId && companyId.companyId,
    });
    res.status === 200 && console.log(res.data);
    res.status === 200 && setUnreadApplicantCount(res.data.count);
  };

  useEffect(() => {
    socket &&
      companyId &&
      socket.on(
        `unread_messages_nav_${companyId && companyId.companyId}`,
        () => {
          setMSGUnreadCount((prev) => prev + 1);
        }
      );
    socket &&
      companyId &&
      socket.on(`unread_applicant_${companyId && companyId.companyId}`, () => {
        setUnreadApplicantCount((prev) => prev + 1);
      });

    return () => {
      if (socket) {
        socket.off(`unread_messages_nav_${companyId && companyId.companyId}`);
        socket.off(`unread_applicant_${companyId && companyId.companyId}`);
      }
    };
  }, [socket, companyId]);

  useEffect(() => {
    getAllUnreadMessagesFunc();
  }, [messages]);

  useEffect(() => {
    getUnreadApplicantFromServer();
  }, []);

  return (
    <div className='menu-company flex-row'>
      <div
        onClick={() => {
          setCompanyMenu("dashboard");
        }}
        className={` ${
          companyMenu === "dashboard" &&
          "border-l-4 border-green-700  text-green-700 pl-3"
        } menu-btn-wrapper p-4 hover:bg-[#F3F3F3] font-semibold text-[#444444] cursor-pointer text-[17px]`}
      >
        <p>Dashboard</p>
      </div>
      <div
        onClick={() => {
          setCompanyMenu("posts");
        }}
        className={` ${
          companyMenu === "posts" &&
          "border-l-4 border-green-700 text-green-700 pl-3"
        } menu-btn-wrapper p-4  hover:bg-[#F3F3F3] font-semibold text-[#444444] cursor-pointer text-[17px]`}
      >
        <p>Page Post</p>
      </div>
      <div
        onClick={() => {
          setCompanyMenu("applications");
        }}
        className={` ${
          companyMenu === "applications" &&
          "border-l-4 border-green-700 text-green-700 pl-3"
        } menu-btn-wrapper p-4 hover:bg-[#F3F3F3] flex items-center justify-between font-semibold text-[#444444] cursor-pointer text-[17px]`}
      >
        <p>Jobs & Applications</p>
        <p>
          {unreadApplicantCount > 0 && companyMenu !== "applications" && (
            <Badge
              badgeContent={unreadApplicantCount}
              className={`${unreadApplicantCount > 0 && "mr-4"}`}
              color='primary'
            ></Badge>
          )}
        </p>
      </div>
      <div
        onClick={() => {
          setCompanyMenu("followers");
        }}
        className={` ${
          companyMenu === "followers" &&
          "border-l-4 border-green-700 text-green-700 pl-3"
        } menu-btn-wrapper p-4 hover:bg-[#F3F3F3] font-semibold text-[#444444] cursor-pointer text-[17px]`}
      >
        <p>Followers & Following</p>
      </div>
      <div
        onClick={() => {
          setCompanyMenu("inbox");
        }}
        className={` ${
          companyMenu === "inbox" &&
          "border-l-4 border-green-700 text-green-700 pl-3"
        } menu-btn-wrapper p-4 hover:bg-[#F3F3F3] flex items-center justify-between font-semibold text-[#444444] cursor-pointer text-[17px]`}
      >
        <p>Inbox</p>
        <p>
          {unreadMSGCount > 0 && companyMenu !== "inbox" && (
            <Badge
              badgeContent={unreadMSGCount}
              className={`${unreadMSGCount > 0 && "mr-4"}`}
              color='primary'
            ></Badge>
          )}
        </p>
      </div>
      <div
        onClick={() => {
          //open dialog
          setEditCompanyDialog(true);
        }}
        className={`  menu-btn-wrapper p-4 hover:bg-[#F3F3F3] font-semibold text-[#444444] cursor-pointer text-[17px]`}
      >
        <p>Edit Page</p>
      </div>
      <div className='p-4'>
        <hr />
      </div>
      <div
        onClick={() => {
          setCompanyMenu("setting");
        }}
        className={` ${
          companyMenu === "setting" &&
          "border-l-4 border-green-700 text-green-700 pl-3"
        } menu-btn-wrapper p-4 hover:bg-[#F3F3F3] font-semibold text-[#444444] cursor-pointer text-[17px]`}
      >
        <p>Setting</p>
      </div>
    </div>
  );
};

export default CompanyMenu;
