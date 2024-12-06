import React, { useEffect, useState, useContext } from "react";
import { AllContext } from "../../../../../../context/UserContext.jsx";

import { Dialog, DialogContent } from "@mui/material";
import {
  getAllApplicationsAccJobId,
  markAsRead,
  updateIsReadJobApp,
  setConversation,
  getMsgAccConvId,
} from "../../../../../../services/api.js";
import IconButton from "@mui/material/IconButton";

import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const dialogStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,

  margin: "auto",
  width: "40vw",
  color: "#000",

  maxHeight: "90vh",

  //   overflow: "hidden",
  borderRadius: "8px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#fff",
};

const ViewApplication = ({
  setJobAppDialog,
  jobAppDialog,
  selectedJob,
  companyDetails,
  setCompanyMenu,
}) => {
  const { setCurrConversationId, currUserData, setMessages } =
    useContext(AllContext);
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const getAllApplicationsAccJob = async () => {
    try {
      let res = await getAllApplicationsAccJobId(selectedJob._id, page);
      if (res.status === 200) {
        console.log("applications", res.data.allApp.applicants);
        setApplications((prev) => [...prev, ...res.data.allApp.applicants]);
        if (res.data.allApp.length < 7) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.log("error whilw getting applications", error.message);
    }
  };

  const updateIsRead = async () => {
    let res = await updateIsReadJobApp({ jobId: selectedJob._id });
    if (res.status === 200) {
      console.log(res.data.message);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const setConversationFunction = async (data) => {
    let res = await setConversation(data);
    if (res.status === 200) {
      console.log(res.data);
      setCurrConversationId(res.data.id);

      let convId = res.data.id;

      let res2 = await getMsgAccConvId({
        convId,
        page: 1,
        limit: 15,
        whoId: companyDetails?._id,
        whoType: "Company",
      });
      if (res2.status === 200) {
        console.log("messages is", res2.data);
        setMessages(res2.data);
      }

      console.log("conversation id selected", convId);
      let res3 = await markAsRead({ convId, userId: companyDetails._id });
      if (res3.status === 200) {
        console.log("message seen by user");
      }

      console.log("connection set");

      setTimeout(() => {
        setCompanyMenu("inbox");
      }, 500);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      updateIsRead();
    }, 100);
  }, [selectedJob]);

  useEffect(() => {
    getAllApplicationsAccJob();
    return () => {
      setApplications([]);
    };
  }, [page, selectedJob]);

  return (
    <Dialog
      open={jobAppDialog}
      onClose={() => setJobAppDialog(false)}
      PaperProps={{
        sx: {
          ...dialogStyle,
        },
      }}
    >
      <div className=' w-[100%] relative h-[100%]'>
        <div className='p-3 border-b-2 border-gray-400 border-opacity-40'>
          <p className='text-[#272727] font-semibold'>All Application</p>
        </div>

        <IconButton
          style={{ position: "absolute", right: 10, top: 5 }}
          onClick={() => setJobAppDialog(false)}
        >
          <CloseIcon className='text-[#272727]' />
        </IconButton>
        <div onScroll={handleScroll} className='max-h-[70%] overflow-y-'>
          {applications &&
            applications.length > 0 &&
            applications.map((app) => {
              return (
                <div
                  key={app._id}
                  onClick={() => {}}
                  className={`flex ${
                    !app.isRead && "bg-[#cdcdd6]"
                  } items-center border-b-2 border-gray-400 border-opacity-40 cursor-pointer  p-3    hover:bg-[#DBDBDC] space-x-2`}
                >
                  <div onClick={() => navigate(`/user/${app.userId._id}`)}>
                    {!app.isRead && (
                      <div className='min-w-[10px] w-[10px] h-[10px] min-h-[10px] relative top-[-5px] left-[-5px] rounded-full bg-green-700'></div>
                    )}
                    <img
                      src={app.userId.profilePicture || "/blank.png"}
                      alt=''
                      className='w-[70px] rounded-full h-[70px]'
                    />
                  </div>
                  <div
                    onClick={() => navigate(`/user/${app.userId._id}`)}
                    className='min-w-[40%] max-w-[40%]'
                  >
                    <p className=' font-semibold text-[16px] hover:underline'>
                      {app.userId.name}
                    </p>
                    <p className=' opacity-70 '>{app.userId.city}</p>
                    <p className=' opacity-30 mt-[-3px]'>
                      {moment(app.createdAt).fromNow()}
                    </p>
                  </div>
                  <div className=''>
                    <div className='flex  space-x-2'>
                      <button
                        className=' bg-white py-2 px-4 rounded-full text-[#0A66C2] border-[2px] border-[#0A66C2] hover:border-[#0072b1] hover:bg-[#ebebeb] focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:ring-offset-2 focus:ring-offset-white'
                        onClick={() => navigate(`/user/${app.userId._id}`)}
                      >
                        View Profile
                      </button>
                      <button
                        className=' bg-blue-700 py-2 px-4 rounded-full text-[#fff] border-[2px] border-blue-700  hover:border-blue-800  hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:ring-offset-2 focus:ring-offset-white'
                        onClick={() => {
                          setConversationFunction({
                            receiverId: app.userId._id,
                            senderType: "Company",
                            senderId: companyDetails._id,
                            receiverType: "User",
                          });
                        }}
                      >
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

          {applications && applications.length === 0 && (
            <>
              <div className='text-center flex justify-center items-center p-3'>
                <img
                  src='/no-data.jpg'
                  className=''
                  alt=''
                  style={{
                    minWidth: "300px",
                    minHeight: "300px",
                    maxWidth: "300px",
                    maxHeight: "300px",
                  }}
                />
              </div>
              <p className='text-center'>No application found</p>
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default ViewApplication;
