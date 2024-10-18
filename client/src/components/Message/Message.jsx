import React, {
  useState,
  useContext,
  useLayoutEffect,
  useEffect,
  useRef,
} from "react";
import Navbar from "../social/Navbar";
import SendIcon from "@mui/icons-material/Send";
import { AllContext } from "../../context/UserContext";
import { toast } from "react-toastify";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import Badge from "@mui/material/Badge";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import Button from "@mui/material/Button";
import { styled } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import AttachmentIcon from "@mui/icons-material/Attachment";
import CloseIcon from "@mui/icons-material/Close";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";

import moment from "moment";

import { useNavigate } from "react-router-dom";
import {
  getReceiverData,
  getAllConversations,
  sendMsg,
  getMsgAccConvId,
  checkConnectionEachOther,
  markAsRead,
  changeFavourite,
  uploadFileAWS,
  getURLForPOST,
  getPresignedURLForDownload,
} from "../../services/api.js";
import Tostify from "../Tostify.jsx";

const StyledButton = styled(Button)`
  border-radius: 100%;
  width: 40px;
  height: 40px;
  padding: 10px;
`;

const Message = () => {
  const {
    isLogin,
    currConversationId,
    setCurrConversationId,
    setCurrMenu,
    allOnlineUsers,
    currUserData,
    messages,
    setMessages,
    socket,
    setAllOnlineUsers,
    unreadMSG,
    setUnreadMSG,
  } = useContext(AllContext);
  const [receiverName, setReceiverName] = useState();
  const [receiverId, setReceiverId] = useState();
  const [conversations, setConversations] = useState([]);
  const [page, setPage] = useState(1); // State to keep track of the current page
  const [hasMore, setHasMore] = useState(true); // State to check if more messages are available
  const limit = 15; // Number of messages to fetch per request
  const [sendMsgText, setSendMsgText] = useState("");
  const [lastMsg, setLastMsg] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null); // for image preview
  const [postFile, setPostFile] = useState(null);
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  console.log("receevier id is", receiverId);
  const [favList, setFavList] = useState(currUserData?.favorites || []);
  const postPhotoRef = useRef();

  const handleOnlineUsers = (onlineUsersData) => {
    setAllOnlineUsers(onlineUsersData);
    console.log("this is onlineusers Data okwwwwwwwwwwy", onlineUsersData);
  };

  // this is for debugging.......
  useEffect(() => {
    console.log("this is unread arr of object inside useEffect", unreadMSG);
  }, [unreadMSG]);

  const socketMessageFunction = async () => {
    socket.on("online_users", handleOnlineUsers);
    // Join the conversation room
    if (currUserData) {
      socket.emit("register", currUserData._id);
    }

    socket.emit("join_conversation", currConversationId && currConversationId);

    socket.on(`unread_messages_${currUserData._id}`, (data) => {
      console.log("unread triggerd and data is", data);
      if (currConversationId !== data.conversationId) {
        setUnreadMSG((prevUnreadMSG) => {
          // Get the unreadMessages object for the specific conversationId
          const conversationUnread = prevUnreadMSG[data.conversationId] || {};

          return {
            ...prevUnreadMSG,
            // Update the unread count for the current user in the specific conversation
            [data.conversationId]: {
              ...conversationUnread,
              [currUserData._id]: data.count, // Update the count for currUserData._id
            },
          };
        });
      }
    });

    // Listen for new messages
    socket.on("receive_message", (message) => {
      console.log("this is receved msg from socketio", message);
      if (message.conversationId === currConversationId) {
        // Mark message as read if conversation is active
        markAsReadFunction(currConversationId, currUserData._id);
        setLastMsg((prevLastMsg) => ({
          ...prevLastMsg,
          [currConversationId]: message.text,
        }));
        console.log("this is last msg", lastMsg);
      }
      if (message.senderId !== currUserData._id) {
        let check = messages.find((msg) => msg._id === message._id);
        if (!check) {
          setMessages((prevMessages) => [...prevMessages, message]);
          // setLastMsg(message.text);
          setTimeout(() => {
            if (chatEndRef.current) {
              chatEndRef.current.scrollIntoView({ behavior: "smooth" });
            }
          }, 200);
        }
      }
      /// change it..
    });

    // Listen for the response to get all currently online users
  };

  useEffect(() => {
    console.log("is login is :", isLogin);
    socketMessageFunction();

    return () => {
      if (socket !== null) {
        socket.off("receive_message");
        socket.off("online_users");
        socket.off("join_conversation");
      }
    };
  }, [currConversationId, socket]);

  useLayoutEffect(() => {
    if (window.location.pathname === "/message") {
      setCurrMenu("message");
    }
    findAllConversationsFunc();
    if (currConversationId) {
      handleConversationSelect(currConversationId);
    }
  }, []);

  const findReceiverData = async () => {
    let res = await getReceiverData({ convId: currConversationId });
    console.log(res.data);
    if (res.status === 200) {
      const { receiverId, receiverName } = res.data;

      console.log("Receiver Data:", receiverId, receiverName);
      setReceiverId(receiverId);
      setReceiverName(receiverName);
    }
  };

  const findAllConversationsFunc = async () => {
    let res = await getAllConversations();
    if (res.status === 200) {
      console.log("all conv", res.data);

      // let allReciverId = res.data.map((conv) => {
      //   return {
      //     [conv.receiverId]: currUserData.favorites.includes(conv.receiverId),
      //   };
      // });

      // setFavList(allReciverId);

      let unread = res.data.map((conv) => {
        return {
          [conv.conversationId]: conv.unreadMessages,
        };
      });

      console.log("unread messages is", unread);
      setUnreadMSG(unread);
      setConversations(res.data);
      setLastMsg((prevLastMsg) => ({
        ...prevLastMsg,
        ...res.data.reduce((acc, conv) => {
          acc[conv.conversationId] = conv.lastMessage;
          return acc;
        }, {}),
      }));
      console.log("this is last msg  beforeee", lastMsg);
    }
  };

  const fetchMessagesFunc = async (id, page, limit) => {
    let res = await getMsgAccConvId(id, page, limit); // Fetch messages with pagination
    if (res.status === 200) {
      console.log("Messages:", res.data);

      // If messages are fetched, prepend them to the existing messages
      setMessages((prevMessages) => [...res.data.reverse(), ...prevMessages]);

      // Check if there are more messages to load
      if (res.data.length < limit) {
        setHasMore(false); // No more messages available
      }
    }
  };

  const handleScroll = (e) => {
    const { scrollTop } = e.target; // Get the scroll position
    // console.log("scrol top is ", scrollTop);
    if (scrollTop === 0 && hasMore) {
      // If user scrolled to the top and more messages are available
      setPage((prevPage) => prevPage + 1); // Increment page number
      // e.target.scrollTop === scrollTop + 173;
    }
  };

  const handleConversationSelect = (convId) => {
    setCurrConversationId(convId); // Select conversation
    setUnreadMSG((prevUnreadMSG) => ({
      ...prevUnreadMSG,
      [convId]: {
        ...prevUnreadMSG[convId],
        [currUserData._id]: 0, // Set unread count for the current user to 0
      },
    }));
    setPage(1); // Reset to page 1 when selecting a new conversation
    markAsReadFunction(convId, currUserData._id); // Mark conversation as read
    setMessages([]); // Clear current messages when selecting a new conversation
  };

  useEffect(() => {
    if (currConversationId) {
      // Only fetch if a conversation is selected
      if (page === 1) {
        // If page is 1, it means we are selecting a new conversation
        fetchMessagesFunc(currConversationId, 1, limit);
        setTimeout(() => {
          chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }, 600);
      } else {
        // If page > 1, it means we are paginating (scrolling up)
        fetchMessagesFunc(currConversationId, page, limit);
      }
    }
  }, [currConversationId, page]);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); //
      if (sendMsgText.trim()) {
        // Check if there is text to send
        handleSendMsg();
      }
    }
  };

  const handleChangeFavourite = async (data) => {
    let res = await changeFavourite(data);
    if (res.status === 200) {
      setFavList((prevFavList) => {
        if (prevFavList.includes(data.receiverId)) {
          return prevFavList.filter((id) => id !== data.receiverId);
        } else {
          return [...prevFavList, data.receiverId];
        }
      });
      console.log(res.data);
    }
  };

  const handleSendMsg = async () => {
    let resChek = await checkConnectionEachOther({ receiverId: receiverId });
    if (resChek.status === 200) {
      console.log("you enable to msg");
      let mediaUrl;

      if (postFile) {
        let res = await getURLForPOST({ fileType: postFile.type });
        if (res.status === 200) {
          console.log(res.data.url);
          const nameOfFile = res.data.fileName;
          // upload in aws

          let resOfAWS = await uploadFileAWS({
            uploadURL: res.data.url,
            postFile,
            fileType: postFile.type,
          });
          if (resOfAWS.status === 200) {
            console.log("uploaded");
            const bukket = import.meta.env.VITE_AWS_S3_BUCKET_NAME;
            const region = import.meta.env.VITE_AWS_REGION;
            const permanentUrlForPost = `https://${bukket}.s3.${region}.amazonaws.com/PostPicture/${nameOfFile}`;
            console.log(permanentUrlForPost);

            mediaUrl = {
              url: permanentUrlForPost,
              fileType: postFile.type,
            };

            if (currConversationId) {
              let res = await sendMsg({
                receiverId: receiverId,
                conversationId: currConversationId,
                text: sendMsgText,
                mediaUrl: mediaUrl,
              });
              if (res.status === 200) {
                // send to socket server
                const message = {
                  senderId: currUserData._id,
                  receiverId: receiverId,
                  conversationId: currConversationId,
                  text: sendMsgText,
                  mediaUrl: mediaUrl,
                  createdAt: new Date(),
                };

                // ui update in message

                setMessages((prevMessages) => [...prevMessages, message]);
                console.log(res.data);
                setTimeout(() => {
                  if (chatEndRef.current) {
                    chatEndRef.current.scrollIntoView({ behavior: "smooth" });
                  }
                }, 200);
                setSendMsgText("");
                setPostFile(null);
                setPreviewUrl(null);
              } else {
                toast.error(
                  `Somthing Error To Send Message, please refresh page`,
                  {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  }
                );
              }
            } else {
              toast.error(`please first select conversation`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
            }
          }
        }
      } else {
        if (currConversationId) {
          let res = await sendMsg({
            receiverId: receiverId,
            conversationId: currConversationId,
            text: sendMsgText,
          });
          if (res.status === 200) {
            // send to socket server
            const message = {
              senderId: currUserData._id,
              receiverId: receiverId,
              conversationId: currConversationId,
              text: sendMsgText,
              createdAt: new Date(),
            };

            // ui update in message

            setMessages((prevMessages) => [...prevMessages, message]);
            console.log(res.data);
            setTimeout(() => {
              if (chatEndRef.current) {
                chatEndRef.current.scrollIntoView({ behavior: "smooth" });
              }
            }, 200);
            setSendMsgText("");
            setPostFile(null);
            setPreviewUrl(null);
          } else {
            toast.error(`Somthing Error To Send Message, please refresh page`, {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }
        } else {
          toast.error(`please first select conversation`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      }
    }
    // setSendMsgText("");
  };

  const markAsReadFunction = async (convId, userId) => {
    let res = await markAsRead({ convId, userId });
    if (res.status === 200) {
      console.log("message seen by user");
    }
  };

  useEffect(() => {
    if (currConversationId) {
      findReceiverData();
    }
  }, [currConversationId]);

  const truncateMessage = (message, maxLength = 15) => {
    return message.length > maxLength
      ? `${message.substring(0, maxLength)}...`
      : message;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    setPostFile(file);
    if (file) {
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleDownloadMsgMedia = async (msg) => {
    const url = msg && msg.mediaUrl && msg.mediaUrl.url;

    const fileName = url.split("/").pop();

    let res = await getPresignedURLForDownload({
      fileName: fileName,
      bucketName: import.meta.env.VITE_AWS_S3_BUCKET_NAME,
    });

    if (res.status === 200) {
      const url_dow = res.data.url; // This is your file URL

      const link = document.createElement("a");
      link.href = url_dow;
      link.setAttribute("download", fileName); // Set the filename in the download attribute
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast.error(`Somthing Error To download media`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className='main-overview w-[100vw] bg-[#F4F2EE] min-h-[100vh]'>
      <Tostify />
      <div className='main-overview-wrapper max-w-[100vw]  overflow-x-hidden'>
        <Navbar />
        <div className='main-display border-2 border-gray-400 shadow-sm border-opacity-40 bg-white w-[80vw] max-h-[900vh] h-[90vh] m-auto mt-[55px] p-4  '>
          <div className='flex   '>
            <div className='conversations-wrapper w-[30%] border-2 border-gray-400 border-opacity-40 border-collapse'>
              <div className='conversations'>
                {conversations && conversations[0] ? (
                  conversations.map((conv) => {
                    const isSelected =
                      currConversationId === conv.conversationId;
                    return (
                      <div
                        key={conv.conversationId}
                        onClick={() =>
                          handleConversationSelect(conv.conversationId)
                        }
                        className={`conversation border-b-2 border-collapse cursor-pointer hover:bg-[#EBEBEB] flex p-2 w-[100%] ${
                          isSelected ? "bg-[#EDF3F8]" : ""
                        }`}
                      >
                        <div className='w-[30%]'>
                          <img
                            src={conv.receiverProfilePicture || "/blank.png"}
                            alt=''
                            className='min-w-[50px] w-[80px] h-[80px] min-h-[50px] border border-gray-400 border-opacity-40 rounded-full'
                          />
                        </div>
                        <div className='w-[70%] '>
                          <p className='text-black'>{conv.receiverName}</p>
                          <p className='text-[#ACACAC] text-sm flex  items-center'>
                            {truncateMessage(
                              (lastMsg && lastMsg[conv.conversationId]) || ""
                            )}

                            <p className=' text-right  flex ml-20 justify-end'>
                              {!isSelected && (
                                <Badge
                                  badgeContent={
                                    currUserData &&
                                    unreadMSG &&
                                    unreadMSG[conv.conversationId]
                                      ? unreadMSG[conv.conversationId][
                                          currUserData._id
                                        ]
                                      : currUserData &&
                                        currUserData._id &&
                                        conv.unreadMessages[currUserData._id]
                                  }
                                  color='primary'
                                  className=''
                                ></Badge>
                              )}
                            </p>
                          </p>
                        </div>

                        <div>
                          {favList && favList.includes(conv.receiverId) && (
                            <StarIcon className='text-[#C37D16]   cursor-pointer' />
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className='text-black p-2 font-semibold mt-9'>
                    <div className=' flex justify-center items-center'>
                      <img src='/nomsg.svg' alt='' className=' w-[90%]' />
                    </div>
                    <p className=' text-center mt-5'>No Any Conversations</p>
                  </div>
                )}
              </div>
            </div>
            <div className='chat-wrapper  w-[70%] max-h-[85vh] min-h-[85vh] p- border-collapse border-2 border-gray-400 border-opacity-40'>
              <div className='chat-heading min-h-[10%] p-2 border border-gray-400 border-opacity-40'>
                <div className='text-black ml-9'>
                  {currConversationId ? (
                    <>
                      <div className='flex justify-between items-center'>
                        <div className=''>
                          <p
                            className=' hover:underline cursor-pointer inline-block'
                            onClick={() => {
                              setCurrMenu("");
                              setTimeout(() => {
                                navigate(`/user/${receiverId}`);
                              }, 500);
                            }}
                          >
                            {receiverName}{" "}
                          </p>
                          <p>
                            {Array.isArray(allOnlineUsers) &&
                            allOnlineUsers.some(
                              (user) => user.userId === receiverId
                            ) ? (
                              <p className=' text-green-700 text-sm flex items-center'>
                                <Brightness1Icon
                                  className='text-green-700 text-xs'
                                  fontSize='6px'
                                />
                                &nbsp;
                                <span className=' text-sm '> Online</span>
                              </p>
                            ) : (
                              <p className='  text-sm '>Offline</p>
                            )}
                          </p>
                        </div>
                        <div className='mr-5  cursor-pointer'>
                          <StyledButton
                            onClick={() => {
                              handleChangeFavourite({ receiverId: receiverId });
                            }}
                          >
                            {favList && favList.includes(receiverId) ? (
                              <StarIcon className='text-[#C37D16]   ' />
                            ) : (
                              <StarBorderIcon className='text-[#C37D16]   ' />
                            )}
                          </StyledButton>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className='p-2 text-black font-semibold'>
                      Please Select Any Conversation
                    </p>
                  )}
                </div>
              </div>
              <div
                onScroll={handleScroll}
                className='chats p-2 pl-10 pr-10 border min-h-[80%] max-h-[80%] overflow-auto flex-row'
              >
                {Array.isArray(messages) &&
                  messages.map((msg, index) => {
                    // check if message shows on the right side or left side based on senderId and currUserData._id
                    const isCurrentUser =
                      currUserData &&
                      currUserData._id &&
                      msg &&
                      msg.senderId === currUserData._id;
                    return (
                      <div
                        key={index}
                        className={`message   flex   mt-2 ${
                          isCurrentUser ? "justify-end" : " justify-start"
                        }`}
                      >
                        <div
                          className={`w-fit p-1 pl-2 pr-2 max-w-[70%] rounded-xl ${
                            isCurrentUser
                              ? " bg-[#F4F2EE] text-black "
                              : "bg-gray-700 text-white "
                          }`}
                        >
                          <p
                            className={` ${
                              isCurrentUser ? "  text-black " : " text-white "
                            }`}
                          >
                            {msg && msg.text && msg.text}
                          </p>
                          {msg && msg.mediaUrl && (
                            <div className=''>
                              {msg.mediaUrl.fileType.startsWith("image") && (
                                <img
                                  src={msg && msg.mediaUrl.url}
                                  alt=''
                                  className='max-w-[200px] min-w-[200px] max-h-[200px] min-h-[200px] rounded-sm'
                                />
                              )}
                              {msg.mediaUrl.fileType.startsWith("video") && (
                                <video
                                  src={msg && msg.mediaUrl.url}
                                  alt=''
                                  controls
                                  preload='metadata'
                                  className='max-w-[300px] min-w-[300px] max-h-[300px] min-h-[300px] rounded-sm'
                                />
                              )}
                              {msg.mediaUrl.fileType ===
                                "application/vnd.openxmlformats-officedocument.presentationml.presentation" && (
                                <img
                                  src={"/pptx.png"}
                                  alt=''
                                  className='max-w-[200px] min-w-[200px] max-h-[200px] min-h-[200px] rounded-sm'
                                />
                              )}
                              {msg.mediaUrl.fileType ===
                                "application/vnd.openxmlformats-officedocument.presentationml.presentation" && (
                                <img
                                  src={"/pptx.png"}
                                  alt=''
                                  className='max-w-[200px] min-w-[200px] max-h-[200px] min-h-[200px] rounded-sm'
                                />
                              )}
                              <IconButton
                                onClick={() => {
                                  handleDownloadMsgMedia(msg);
                                }}
                              >
                                <DownloadForOfflineIcon />
                              </IconButton>
                            </div>
                          )}

                          <p className='text-gray-400'>
                            {moment(msg && msg.createdAt).fromNow()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                <div ref={chatEndRef} />
                {!currConversationId && (
                  <div>
                    <div>
                      <div className=' max-h-[400px] flex justify-center items-center'>
                        <img
                          src='/work.png'
                          alt=''
                          className=' max-h-[400px] '
                        />
                      </div>
                      <p className=' font-semibold text-center'>
                        Please Select Conversation
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className='msg-ipnut min-h-[9%] p-2 border '>
                <div className='flex items-center space-x-1 relative'>
                  <div className='flex justify-center items-center'>
                    <IconButton color='primary' aria-label='add an emoji'>
                      <SentimentSatisfiedAltIcon onClick={() => {}} />
                    </IconButton>
                    <IconButton color='secondary' aria-label='add a file'>
                      <AttachmentIcon
                        onClick={() => {
                          postPhotoRef.current.click();
                        }}
                      />
                      <div className='profile-file-form'>
                        <input
                          type='file'
                          name=''
                          id=''
                          ref={postPhotoRef}
                          onChange={(e) => {
                            handleFileChange(e);
                          }}
                        />
                      </div>
                    </IconButton>
                  </div>

                  {postFile && (
                    <div className=' flex justify-center items-center absolute top-[-60px] right-[80px]'>
                      {postFile.type.startsWith("video/") && (
                        <video
                          src={previewUrl}
                          controls
                          className='min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px] rounded-md'
                        />
                      )}
                      {postFile.type.startsWith("image/") && (
                        <img
                          src={previewUrl}
                          alt='preview'
                          className='min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px] rounded-md'
                        />
                      )}
                      {postFile.type ===
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
                        <div className='flex space-x-1 justify-center items-center border-2 rounded-sm border-gray-400 border-opacity-40 p-1'>
                          <img
                            src='/docs.png'
                            alt='preview docs'
                            className='min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px] rounded-md'
                          />
                          <p>{postFile.name}</p>
                        </div>
                      )}
                      {postFile.type ===
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && (
                        <div className='flex space-x-1 bg-white justify-center items-center border-2 rounded-sm border-gray-400 border-opacity-40 p-1'>
                          <img
                            src='/excle.png'
                            alt='preview docs'
                            className='min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px] rounded-md'
                          />
                          <p>{postFile.name}</p>
                        </div>
                      )}
                      {postFile.type === "application/x-javascript" && (
                        <div className='flex space-x-1 bg-white justify-center items-center border-2 rounded-sm border-gray-400 border-opacity-40 p-1'>
                          <img
                            src='/js.png'
                            alt='preview docs'
                            className='min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px] rounded-md'
                          />
                          <p>{postFile.name}</p>
                        </div>
                      )}
                      {postFile.type === "text/css" && (
                        <div className='flex space-x-1 bg-white justify-center items-center border-2 rounded-sm border-gray-400 border-opacity-40 p-1'>
                          <img
                            src='/js.png'
                            alt='preview docs'
                            className='min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px] rounded-md'
                          />
                          <p>{postFile.name}</p>
                        </div>
                      )}
                      {postFile.type ===
                        "application/vnd.openxmlformats-officedocument.presentationml.presentation" && (
                        <div className='flex space-x-1 bg-white justify-center items-center border-2 rounded-sm border-gray-400 border-opacity-40 p-1'>
                          <img
                            src='/pptx.png'
                            alt='preview docs'
                            className='min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px] rounded-md'
                          />
                          <p>{postFile.name}</p>
                        </div>
                      )}

                      <CloseIcon
                        className=' cursor-pointer hover:text-red-500 text-[#fff] bg-[#4b4b4b] rounded-full absolute top-[-11px] right-[-9px]'
                        onClick={() => {
                          setPostFile(null);
                          setPreviewUrl(null);
                        }}
                        fontSize='small'
                      />
                    </div>
                  )}

                  <input
                    type='text'
                    name='msg'
                    value={sendMsgText}
                    id='inp-msg'
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                      setSendMsgText(e.target.value);
                    }}
                    placeholder='Enter Message'
                    className='inp-message p-2 placeholder:text-[#3c3737] rounded-md border border-gray-400 w-[95%]'
                  />
                  <Button
                    onClick={() => {
                      handleSendMsg();
                    }}
                    disabled={sendMsgText === "" && postFile === null}
                  >
                    <SendIcon
                      className={` cursor-pointer  ml-2 ${
                        sendMsgText === "" && postFile === null
                          ? "text-gray-400"
                          : " text-[#3986c9]"
                      } `}
                      fontSize='large'
                    />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
