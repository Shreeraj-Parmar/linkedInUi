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

import moment from "moment";

import { useNavigate } from "react-router-dom";
import {
  getReceiverData,
  getAllConversations,
  sendMsg,
  getMsgAccConvId,
  checkConnectionEachOther,
  markAsRead,
} from "../../services/api.js";
import Tostify from "../Tostify.jsx";
import SocketReConnect from "../socket-reconnect/SocketReConnect.jsx";

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
    setAllOnlineUsers,
  } = useContext(AllContext);
  const [receiverName, setReceiverName] = useState();
  const [receiverId, setReceiverId] = useState();
  const [conversations, setConversations] = useState([]);

  const [sendMsgText, setSendMsgText] = useState("");
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const socket = window.socketClient;
  // const onlineUsers = window.onlineUsers;

  const handleOnlineUsers = (onlineUsersData) => {
    setAllOnlineUsers(onlineUsersData);
    console.log("this is onlineusers Data", onlineUsersData);
  };

  const socketMessageFunction = async () => {
    // Join the conversation room
    if (currConversationId) {
      socket.emit("join_conversation", currConversationId);
    }
    socket.on("all_online_users", handleOnlineUsers);

    // Listen for new messages
    socket.on("receive_message", (message) => {
      console.log("this is receved msg from socketio", message);
      if (message.conversationId === currConversationId) {
        // Mark message as read if conversation is active
        markAsReadFunction(currConversationId, currUserData._id);
      }
      if (message.senderId !== currUserData._id) {
        let check = messages.find((msg) => msg._id === message._id);
        if (!check) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      }
      /// change it..
    });

    // Listen for the response to get all currently online users
  };

  useEffect(() => {
    if (window.socketClient) {
      socketMessageFunction();
    }
    return () => {
      socket.off("receive_message");
      socket.off("all_online_users");
      socket.off("join_conversation");
    };
  }, []);

  useEffect(() => {
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
      setConversations(res.data);
    }
  };

  const fetchMessagesFunc = async (id) => {
    let res = await getMsgAccConvId(id);
    if (res.status === 200) {
      console.log("messages is", res.data);
      setMessages(res.data);
    }
  };

  const handleConversationSelect = (convId) => {
    setCurrConversationId(convId);
    markAsReadFunction(convId, currUserData._id);
    fetchMessagesFunc(convId);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); //
      if (sendMsgText.trim()) {
        // Check if there is text to send
        handleSendMsg();
      }
    }
  };

  const handleInputChange = (e) => {
    setSendMsgText(e.target.value);
  };

  const handleSendMsg = async () => {
    let resChek = await checkConnectionEachOther({ receiverId: receiverId });
    if (resChek.status === 200) {
      console.log("you enable to msg");

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

          // socket.emit("send_message", {
          //   conversationId: currConversationId,
          //   message,
          // });

          // ui update in message

          setMessages((prevMessages) => [...prevMessages, message]);
          console.log(res.data);
          // fetchMessagesFunc(currConversationId);
          setSendMsgText("");
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
        setSendMsgText("");
      }
    } else if (resChek.status === 201) {
      console.log("you not .. enable to msg first connect please");
      toast.error(`${resChek.data}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
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

  useEffect(() => {
    findAllConversationsFunc();
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // useLayoutEffect(() => {
  //   if (!isLogin) {
  //     setTimeout(() => {
  //       navigate("/");
  //     }, 1000);
  //   }
  // }, []);
  const truncateMessage = (message, maxLength = 10) => {
    return message.length > maxLength
      ? `${message.substring(0, maxLength)}...`
      : message;
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
                            {truncateMessage(conv.lastMessage)}
                            <p className=' text-right  flex ml-20 justify-end'>
                              <Badge
                                badgeContent={
                                  currUserData &&
                                  conv.unreadMessages[currUserData._id]
                                }
                                color='primary'
                                className=''
                              ></Badge>
                            </p>
                          </p>
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
                      <p
                        className=' hover:underline cursor-pointer'
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
                        {allOnlineUsers &&
                        allOnlineUsers.userId === receiverId ? (
                          <p className=' text-green-700 text-sm flex items-center'>
                            <Brightness1Icon
                              className='text-green-700 text-xs'
                              fontSize='6px'
                            />
                            &nbsp;
                            <span className=' text-sm'> Online</span>
                          </p>
                        ) : (
                          <p className='  text-sm'>Offline</p>
                        )}
                      </p>
                    </>
                  ) : (
                    <p className='p-2 text-black font-semibold'>
                      Please Select Any Conversation
                    </p>
                  )}
                </div>
              </div>
              <div className='chats p-2 pl-10 pr-10 border min-h-[80%] max-h-[80%] overflow-y-scroll'>
                {Array.isArray(messages) &&
                  messages.map((msg, index) => {
                    if (!msg || !msg.text) {
                      console.warn("Undefined message or text found:", msg);
                      return null; // Skip undefined or invalid messages
                    }
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
                            {msg && msg.text}
                          </p>
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
                <div className='flex items-center'>
                  <input
                    type='text'
                    name='msg'
                    value={sendMsgText}
                    id='inp-msg'
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    placeholder='Enter Message'
                    className='inp-message p-2 placeholder:text-[#3c3737] rounded-md border border-gray-400 w-[95%]'
                  />
                  <SendIcon
                    onClick={() => {
                      handleSendMsg();
                    }}
                    className=' cursor-pointer text-[#444444] ml-2 '
                    fontSize='large'
                  />
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
