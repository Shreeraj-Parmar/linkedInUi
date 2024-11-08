import React, {
  useState,
  useContext,
  useLayoutEffect,
  useEffect,
  useRef,
} from "react";
import SendIcon from "@mui/icons-material/Send";
import { AllContext } from "../../../../../context/UserContext";
import { toast } from "react-toastify";
import linkifyContent from "../../../../../utils/linkify.js";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import {
  getReceiverData,
  getAllConversations,
  sendMsg,
  getMsgAccConvId,
  markAsRead,
  changeFavourite,
  uploadFileAWS,
  getURLForPOST,
  getPresignedURLForDownload,
} from "../../../../../services/api.js";

import Badge from "@mui/material/Badge";

import StarBorderIcon from "@mui/icons-material/StarBorder";

import StarIcon from "@mui/icons-material/Star";

import Button from "@mui/material/Button";

import IconButton from "@mui/material/IconButton";

import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";

import AttachmentIcon from "@mui/icons-material/Attachment";
import CloseIcon from "@mui/icons-material/Close";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";
import { useNavigate } from "react-router-dom";

import Picker from "emoji-picker-react";
import DeleteMsgDialog from "../../../../Message/DeleteMsgDialog.jsx";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";

const Inbox = ({ companyId, companyDetails }) => {
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
    actAs,
    setActAs,
  } = useContext(AllContext);
  const [receiverName, setReceiverName] = useState();
  const [receiverId, setReceiverId] = useState();
  const [typeOfReceiver, setTypeOfReceiver] = useState();
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
  const [favList, setFavList] = useState([]);
  const postPhotoRef = useRef();
  const inputRef = useRef(null);
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [timer, setTimer] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [data_convId, setdata_convId] = useState(null);

  const handleOnlineUsers = (onlineUsersData) => {
    setAllOnlineUsers(onlineUsersData);
    console.log("this is onlineusers Data okwwwwwwwwwwy", onlineUsersData);
  };

  // this is for debugging...........
  useEffect(() => {
    console.log("this is unread arr of object inside useEffect", unreadMSG);
    console.log("curruntConvId is", currConversationId);
  }, [unreadMSG]);

  useEffect(() => {
    if (currConversationId === data_convId) {
      setUnreadMSG((prevUnreadMSG) => {
        return {
          ...prevUnreadMSG,
          [data_convId]: 0,
        };
      });
    }
  }, [data_convId, messages]);

  // for fav or not!
  useEffect(() => {
    if (companyDetails) {
      setFavList(companyDetails.favorites);
    }
  }, [companyDetails]);

  const socketMessageFunction = async () => {
    socket.on("online_users", handleOnlineUsers);
    // Join the conversation room
    if (companyId) {
      socket.emit("register", companyId && companyId.companyId);
    }

    socket.emit("join_conversation", currConversationId && currConversationId);

    socket.on(`unread_messages_${String(companyId.companyId)}`, (data) => {
      setdata_convId(data.conversationId);
      console.log(
        "unread triggerd and data is",
        data,
        "and currConvid :",
        currConversationId
      );

      // this is testing
      console.log(
        " chck if currConvid and data convId are same :",
        currConversationId === data.conversationId
      );
      if (
        (currConversationId &&
          currConversationId.toString() !== data.conversationId.toString()) ||
        currConversationId === null
      ) {
        console.log(
          `this is currConvId ${currConversationId} and data convId ${data.conversationId}`
        );
        setUnreadMSG((prevUnreadMSG) => {
          return {
            ...prevUnreadMSG,
            [data.conversationId]: data.count,
          };
        });
      }
    });

    // Listen for new messages
    socket.on("receive_message", (message) => {
      console.log("this is receved msg from socketio", message);
      setLastMsg((prevLastMsg) => ({
        ...prevLastMsg,
        [message.conversationId]:
          message.mediaUrl && message.mediaUrl.url
            ? "Send An Attachment"
            : message.text,
      }));
      if (message.conversationId === currConversationId) {
        // Mark message as read if conversation is active
        markAsReadFunction(
          currConversationId,
          companyId && companyId.companyId
        );
        console.log("this is last msg", lastMsg);
        if (String(message.sender.id) !== String(companyId.companyId)) {
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
      }
      /// change it..
    });

    // Listen for the response to get all currently online users
  };

  useEffect(() => {
    if (currConversationId === null) {
      setCurrConversationId("");
    }
    console.log("is login is :", isLogin);
    if (socket) socketMessageFunction();

    return () => {
      if (socket !== null) {
        socket.off("receive_message");
        socket.off("online_users");
        socket.off("join_conversation");
      }
    };
  }, [currConversationId, socket, isLogin]);

  useLayoutEffect(() => {
    findAllConversationsFunc();
    if (currConversationId) {
      handleConversationSelect(currConversationId);
    }
  }, [currConversationId]);

  const findReceiverData = async () => {
    let res = await getReceiverData({
      convId: currConversationId,
      senderId: companyId && companyId.companyId,
    });
    console.log(res.data);
    if (res.status === 200) {
      const { receiverId, receiverName, receiverType } = res.data;
      console.log("Receiver Data:", receiverId, receiverName, receiverType);
      setReceiverId(receiverId);
      setTypeOfReceiver(receiverType);
      setReceiverName(receiverName);
    }
  };

  const findAllConversationsFunc = async () => {
    let res = await getAllConversations({
      reqId: companyId && companyId.companyId,
      reqIdType: "Company",
    });
    if (res.status === 200) {
      console.log("all conv", res.data);

      let unread = {};

      // Loop over each conversation and add the receiverId: unreadMessages pair to the unread object
      res.data.forEach((conv) => {
        unread[conv.conversationId] = conv.unreadMessages;
      });

      console.log("unread messages is okkkkkkgkgkgkgkgkgkgkkgkgkgkgk", unread);
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
    let res = await getMsgAccConvId({
      convId: id,
      page: page,
      limit: limit,
      whoId: companyId && companyId.companyId,
      whoType: "Company",
    }); // Fetch messages with pagination
    if (res.status === 200) {
      console.log("Messages:", res.data);

      const modifiedMessages = res.data.map((message) => ({
        ...message,
        selected: false,
      }));

      // Prepend the modified messages to the existing messages
      setMessages((prevMessages) => [
        ...modifiedMessages.reverse(),
        ...prevMessages,
      ]);

      // Check if there are more messages to load
      if (res.data.length < limit) {
        setHasMore(false); // No more messages available
      }
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target; // Get the scroll position
    // console.log(
    //   "client height is ",
    //   clientHeight,
    //   "scroll height is ",
    //   scrollHeight,
    //   "scroll top is ",
    //   scrollTop
    // );
    if (scrollTop === 0 && hasMore) {
      // If user scrolled to the top and more messages are available
      setPage((prevPage) => prevPage + 1); // Increment page number
      // e.target.scrollTop === scrollTop + 173;
    }
    if (scrollTop + clientHeight < scrollHeight) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

  const handleConversationSelect = (convId) => {
    setCurrConversationId(convId); // Select conversation
    setUnreadMSG((prevUnreadMSG) => ({
      ...prevUnreadMSG,
      [convId]: 0, // Set unread count for the current user to 0
    }));
    setPage(1); // Reset to page 1 when selecting a new conversation
    markAsReadFunction(convId, companyId && companyId.companyId); // Mark conversation as read
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
        if (prevFavList.some((fav) => fav.id === data.receiverId)) {
          return prevFavList.filter((fav) => fav.id !== data.receiverId);
        } else {
          let newOb = {
            id: data.receiverId,
            type: data.receiverType,
          };
          return [...prevFavList, newOb];
        }
      });
      console.log(res.data);
    }
  };

  const handleSendMsg = async () => {
    // let resChek = await checkConnectionEachOther({ receiverId: receiverId });
    // if (resChek.status === 200) {
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
              senderId: companyId && companyId.companyId,
              receiverType: typeOfReceiver,
              senderType: "Company",
              conversationId: currConversationId,
              text: sendMsgText,
              mediaUrl: mediaUrl,
            });
            if (res.status === 200) {
              // send to socket server
              const message = {
                sender: {
                  id: companyId && companyId.companyId,
                  type: "Company",
                },
                receiver: {
                  id: receiverId,
                  type: typeOfReceiver,
                },
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
          senderId: companyId && companyId.companyId,
          receiverType: typeOfReceiver,
          senderType: "Company",
          conversationId: currConversationId,
          text: sendMsgText,
        });
        if (res.status === 200) {
          // send to socket server
          const message = {
            sender: {
              id: companyId && companyId.companyId,
              type: "Company",
            },
            receiver: {
              id: receiverId,
              type: typeOfReceiver,
            },
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
    // }
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

  const truncateMessage = (message, maxLength = 10) => {
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
    let fileExe = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/pdf",
      "application/msword",
      "application/vnd.ms-excel",
      "application/vnd.ms-powerpoint",
      "text/plain",
    ];

    if (fileExe.includes(msg.mediaUrl.fileType)) {
      const url_dow = msg.mediaUrl.url; // This is your file URL

      const link = document.createElement("a");
      link.href = url_dow;
      link.setAttribute("download", ""); // Set the filename in the download attribute
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const url = msg && msg.mediaUrl && msg.mediaUrl.url;

    const fileName = url.split("/").pop();

    console.log("filemane : ", fileName);

    let res = await getPresignedURLForDownload({
      fileName: fileName,
      bucketName: import.meta.env.VITE_AWS_S3_BUCKET_NAME,
    });

    if (res.status === 200) {
      const url_dow = res.data.url; // This is your file URL
      console.log("url presined is the thne rjnerfd : ", url_dow);
      const link = document.createElement("a");
      link.href = url_dow;
      link.setAttribute("download", ""); // Set the filename in the download attribute
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

  // msg selsection and deletion

  const handleSelectMsg = (id) => {
    if (isMultiSelectMode) {
      setMessages(
        messages.map((msg) =>
          msg._id === id ? { ...msg, selected: !msg.selected } : msg
        )
      );
      const hasSelectedMsgs = messages.some((msg) =>
        msg._id === id ? !msg.selected : msg.selected
      );
      // console.log("selsected msg", hasSelectedMsgs);
      if (!hasSelectedMsgs) {
        setIsMultiSelectMode(false);
      }
    }
  };
  useEffect(() => {
    return () => {
      setMessages([]);
      setSendMsgText("");
      setPostFile(null);
      setPreviewUrl(null);
      setReceiverId(null);
      setTypeOfReceiver(null);
    };
  }, []);

  return (
    <div className=' border-2 border-gray-400 min-h-[83vh] max-h-[83vh] fixed w-[60%] bg-white border-opacity-40 flex rounded-lg'>
      <div className=' msg-lft-company w-[35%] border-r-2 border-gray-400 border-opacity-40'>
        <div className='p-4 rounded-t-lg border-b-2 border-gray-400 bg-white border-opacity-40 '>
          <p className='font-semibold text-[#444444]'>Inbox</p>
        </div>
        <div className=''>
          <div className='conversations'>
            {conversations && conversations[0] ? (
              conversations.map((conv) => {
                const isSelected = currConversationId === conv.conversationId;
                return (
                  <div
                    key={conv.conversationId}
                    onClick={() =>
                      handleConversationSelect(conv.conversationId)
                    }
                    className={`conversation border-b-2 relative border-collapse cursor-pointer hover:bg-[#EBEBEB] flex p-2 w-[100%] ${
                      isSelected ? "bg-[#EDF3F8]  " : ""
                    }`}
                  >
                    {isSelected && (
                      <div className='w-[3.5px] bg-[#01754F] absolute top-[-0.5px] left-[-1.5px] h-[78px]'></div>
                    )}
                    <div className='w-[30%] relative '>
                      <img
                        src={conv.receiverProfilePicture || "/blank.png"}
                        alt=''
                        className='min-w-[60px] max-w-[60px] max-h-[60px] min-h-[60px] border border-gray-400 border-opacity-40 rounded-full'
                      />
                      {Array.isArray(allOnlineUsers) &&
                        allOnlineUsers.some(
                          (user) => user.userId === conv.receiverId
                        ) && (
                          <div className='absolute bottom-0 right-6 w-[10px] h-[10px] bg-green-600 rounded-full'></div>
                        )}
                    </div>
                    <div className='w-[70%] '>
                      <p className='text-black'>{conv.receiverName}</p>
                      <p className='text-[#ACACAC] text-sm flex  items-center'>
                        {truncateMessage(
                          (lastMsg && lastMsg[conv.conversationId]) ||
                            messages[messages.length - 1]?.text ||
                            ""
                        )}

                        <p className=' text-right  flex ml-20 justify-end'>
                          {!isSelected && (
                            <Badge
                              badgeContent={
                                unreadMSG && unreadMSG[conv.conversationId]
                                  ? unreadMSG[conv.conversationId]
                                  : conv.unreadMessages[currConversationId]
                              }
                              color='primary'
                              className=''
                            ></Badge>
                          )}
                        </p>
                      </p>
                    </div>
                    <div className='min-w-[50px] '>
                      {favList &&
                        favList.some((f) => f.id === conv.receiverId) && (
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
      </div>
      <div className=' msg-lft-company w-[65%]'>
        <div className='border-b-2 border-gray-400 border-opacity-40 '>
          <div className='text-black ml-9 p-[6px]'>
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
                          <span className=' text-sm '>
                            Available In Desktop
                          </span>
                        </p>
                      ) : (
                        <p className='  text-sm '>Not Available</p>
                      )}
                    </p>
                  </div>
                  <div className='mr-5 flex justify-center items-center  cursor-pointer'>
                    <IconButton
                      onClick={() => {
                        handleChangeFavourite({
                          receiverId: receiverId,
                          receiverType: typeOfReceiver,
                          senderId: companyId && companyId.companyId,
                          senderType: "Company",
                        });
                      }}
                    >
                      {favList &&
                      favList.some((fav) => fav.id === receiverId) ? (
                        <StarIcon className='text-[#C37D16]   ' />
                      ) : (
                        <StarBorderIcon className='text-[#C37D16]   ' />
                      )}
                    </IconButton>
                    <DeleteMsgDialog
                      deleteDialog={deleteDialog}
                      setDeleteDialog={setDeleteDialog}
                      setMessages={setMessages}
                      messages={messages}
                      setIsMultiSelectMode={setIsMultiSelectMode}
                      setLastMsg={setLastMsg}
                      currConversationId={currConversationId}
                    />
                    {isMultiSelectMode && (
                      <div
                        onClick={() => {
                          setDeleteDialog(true);
                        }}
                      >
                        <IconButton>
                          <DeleteIcon className='text-red-400' />
                        </IconButton>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p className='p-2.5 text-black font-semibold'>
                Please Select Any Conversation
              </p>
            )}
          </div>
        </div>

        <div
          onScroll={handleScroll}
          className='chats p-2 pl-10 pr-10  min-h-[80%] max-h-[80%] overflow-auto flex-row'
        >
          {Array.isArray(messages) &&
            messages.map((msg, index) => {
              // check if message shows on the right side or left side based on senderId and currUserData._id
              const isCurrentUser =
                msg &&
                msg.sender &&
                companyId &&
                String(msg.sender.id) === String(companyId.companyId);

              return (
                <div
                  onMouseDown={() => {
                    const newTimer = setTimeout(() => {
                      setIsMultiSelectMode(true);
                    }, 500); // Long press threshold (500ms)
                    setTimer(newTimer);
                  }}
                  onClick={() => handleSelectMsg(msg._id)}
                  onMouseUp={() => clearTimeout(timer)}
                  key={index}
                  className={`message hover:bg-[#F4F2EE] cursor-pointer ${
                    msg.selected && "bg-[#EDF3F8]"
                  }   flex   mt-2 ${
                    isCurrentUser ? "justify-end" : " justify-start"
                  }`}
                >
                  <div
                    className={`w-fit p-1 pl-2 pr-2 max-w-[70%] rounded-xl ${
                      isCurrentUser
                        ? " bg-[#F5F5F5] text-[#333333] "
                        : "bg-[#3D4852] text-white "
                    }`}
                  >
                    <p
                      className={` ${
                        isCurrentUser ? "  text-[#333333] " : " text-white "
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: linkifyContent(
                          msg && msg.text && msg.text,
                          isCurrentUser ? "blue" : "yellow"
                        ),
                      }}
                    ></p>
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
                          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
                          <img
                            src={"/docs.png"}
                            alt=''
                            className='max-w-[200px] min-w-[200px] max-h-[200px] min-h-[200px] rounded-sm'
                          />
                        )}
                        {msg.mediaUrl.fileType ===
                          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && (
                          <img
                            src={"/excle.png"}
                            alt=''
                            className='max-w-[200px] min-w-[200px] max-h-[200px] min-h-[200px] rounded-sm'
                          />
                        )}
                        {msg.mediaUrl.fileType ===
                          "application/x-javascript" && (
                          <img
                            src={"/js.png"}
                            alt=''
                            className='max-w-[200px] min-w-[200px] max-h-[200px] min-h-[200px] rounded-sm'
                          />
                        )}
                        {msg.mediaUrl.fileType === "text/css" && (
                          <img
                            src={"/css.png"}
                            alt=''
                            className='max-w-[200px] min-w-[200px] max-h-[200px] min-h-[200px] rounded-sm'
                          />
                        )}
                        {msg.mediaUrl.fileType === "application/pdf" && (
                          <img
                            src={"/pdf.png"}
                            alt=''
                            className='max-w-[200px] min-w-[200px] max-h-[200px] min-h-[200px] rounded-sm'
                          />
                        )}

                        <IconButton
                          onClick={() => {
                            handleDownloadMsgMedia(msg);
                          }}
                        >
                          <DownloadForOfflineIcon
                            className={`${
                              isCurrentUser ? "text-[#333333]" : "text-white"
                            }`}
                          />
                        </IconButton>
                      </div>
                    )}

                    <p className='text-[#A0AEC0]'>
                      {moment(msg && msg.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              );
            })}
          <div ref={chatEndRef} />
          {showScrollButton && (
            <div className='relative flex justify-end'>
              <button
                className='scroll-down-btn  bottom-[150px] fixed rounded-full'
                onClick={() => {
                  chatEndRef.current.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                <ExpandCircleDownIcon
                  className='text-[#A0AEC0] hover:text-[#3D4852]'
                  fontSize='large'
                />
              </button>
            </div>
          )}

          {!currConversationId && (
            <div>
              <div>
                <div className=' max-h-[400px] flex justify-center items-center'>
                  <img src='/work.png' alt='' className=' max-h-[400px] ' />
                </div>
                <p className=' font-semibold text-center'>
                  Please Select Conversation
                </p>
              </div>
            </div>
          )}
        </div>
        <div className='msg-ipnut min-h-[9%] max-h-[9%] p-2 border-t-2 border-gray-400 border-opacity-40 '>
          <div className='flex items-center space-x-1 relative'>
            <div className='flex justify-center items-center relative'>
              {isEmojiPickerVisible && (
                <div className=' absolute top-[-460px] right-[-50px] '>
                  <Picker
                    onEmojiClick={(e) => {
                      const emoji = e.emoji; // Get the selected emoji
                      const input = inputRef.current; // Get the input field reference
                      const start = input.selectionStart; // Get cursor position (start of selection)
                      const end = input.selectionEnd; // Get cursor position (end of selection)
                      const newText =
                        sendMsgText.slice(0, start) +
                        emoji +
                        sendMsgText.slice(end);

                      setSendMsgText(newText); // Set the new text with emoji
                      setIsEmojiPickerVisible(false); // Close the picker
                      input.focus(); // Move focus back to the input field

                      // Set the cursor position right after the emoji
                      input.setSelectionRange(
                        start + emoji.length,
                        start + emoji.length
                      );
                    }}
                  />
                </div>
              )}
              <IconButton color='primary' aria-label='add an emoji'>
                <SentimentSatisfiedAltIcon
                  onClick={() => {
                    setIsEmojiPickerVisible(!isEmojiPickerVisible);
                  }}
                />
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
                {postFile.type === "application/pdf" && (
                  <div className='flex space-x-1 bg-white justify-center items-center border-2 rounded-sm border-gray-400 border-opacity-40 p-1'>
                    <img
                      src='/pdf.png'
                      alt='preview docs'
                      className='min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px] rounded-md'
                    />
                    <p>{postFile.name}</p>
                  </div>
                )}
                {postFile.type === "audio/mpeg" && (
                  <div className='flex space-x-1 bg-white justify-center items-center border-2 rounded-sm border-gray-400 border-opacity-40 p-1'>
                    <img
                      src='/mp3.png'
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
              ref={inputRef}
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
  );
};

export default Inbox;
