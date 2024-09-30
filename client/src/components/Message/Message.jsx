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

import moment from "moment";

import { useNavigate } from "react-router-dom";
import {
  getReceiverData,
  getAllConversations,
  sendMsg,
  getMsgAccConvId,
} from "../../services/api.js";

const Message = () => {
  const { isLogin, currConversationId, setCurrConversationId, currUserData } =
    useContext(AllContext);
  const [receiverName, setReceiverName] = useState();
  const [receiverId, setReceiverId] = useState();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [sendMsgText, setSendMsgText] = useState("");
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

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
    let res = await sendMsg({
      receiverId: receiverId,
      conversationId: currConversationId,
      text: sendMsgText,
    });
    console.log(res.data);
    setSendMsgText("");
    fetchMessagesFunc(currConversationId);
  };

  useEffect(() => {
    if (currConversationId) {
      findReceiverData();
    }
  }, [currConversationId]);

  useEffect(() => {
    findAllConversationsFunc();
  }, [messages]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // This effect runs every time messages change

  // useLayoutEffect(() => {
  //   if (!isLogin) {
  //     setTimeout(() => {
  //       navigate("/social");
  //     }, 1000);
  //   }
  // }, []);
  return (
    <div className="main-overview w-[100vw] bg-black min-h-[100vh]">
      <div className="main-overview-wrapper max-w-[100vw]  overflow-x-hidden">
        <Navbar />
        <div className="main-display border border-red-500 w-[80vw] max-h-[900vh] h-[90vh] m-auto mt-[55px] p-4  ">
          <div className="flex   space-x-5">
            <div className="conversations-wrapper w-[30%] border border-green-400">
              <div className="conversations">
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
                        className={`conversation border border-collapse cursor-pointer hover:bg-[#303030] flex p-2 w-[100%] ${
                          isSelected ? "bg-[#38434F]" : ""
                        }`}
                      >
                        <div className="w-[30%]">
                          <img
                            src={conv.receiverProfilePicture || "/blank.png"}
                            alt=""
                            className="min-w-[50px] w-[80px] h-[80px] min-h-[50px] border border-white rounded-full"
                          />
                        </div>
                        <div className="w-[70%] ">
                          <p className="text-white">{conv.receiverName}</p>
                          <p className="text-[#ACACAC] text-sm">
                            {conv.lastMessageSenderId === currUserData._id
                              ? "You"
                              : conv.receiverName}
                            : {conv.lastMessage}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-white">No Any Conversations</div>
                )}
              </div>
            </div>
            <div className="chat-wrapper  w-[70%] max-h-[85vh] min-h-[85vh] p-2 border border-green-400">
              <div className="chat-heading min-h-[10%] p-2 border border-gray-400">
                <div className="text-white ml-9">
                  <p>{receiverName} </p>
                  <p>online/offline</p>
                </div>
              </div>
              <div className="chats p-2 pl-10 pr-10 border min-h-[80%] max-h-[80%] overflow-y-scroll">
                {messages &&
                  messages.map((msg) => {
                    const isCurrentUser = msg.senderId === currUserData._id;
                    return (
                      <div
                        key={msg._id}
                        className={`message   flex r  mt-2 ${
                          isCurrentUser ? "  justify-end" : " justify-start"
                        }`}
                      >
                        <div
                          className={`w-fit p-1 pl-2 pr-2 max-w-[70%] rounded-xl ${
                            isCurrentUser
                              ? " bg-blue-500 text-white "
                              : "bg-gray-700 text-white "
                          }`}
                        >
                          <p className="text-white">{msg.text}</p>
                          <p className="text-gray-400">
                            {moment(msg.createdAt).fromNow()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                <div ref={chatEndRef} />
              </div>
              <div className="msg-ipnut min-h-[10%] p-2 border border-yellow-700">
                <div className="flex items-center">
                  <input
                    type="text"
                    name="msg"
                    value={sendMsgText}
                    id="inp-msg"
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    placeholder="Enter Message"
                    className="inp-message p-2 rounded-md border w-[95%]"
                  />
                  <SendIcon
                    onClick={() => {
                      handleSendMsg();
                    }}
                    className=" cursor-pointer text-white ml-2 "
                    fontSize="large"
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
