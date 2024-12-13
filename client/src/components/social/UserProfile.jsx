import React, { useEffect, useLayoutEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "./../Loader/Loader.jsx";
import {
  getUserDataAccId,
  sendFollowReq,
  sendConnect,
  sendNotification,
  setConversation,
  getMsgAccConvId,
  markAsRead,
  checkConnectionEachOther,
  deleteJob,
  getAllJobsAcc,
  checkOutReward
} from "../../services/api.js";
import LoginDialog from "./LoginDialog.jsx";
import { AllContext } from "../../context/UserContext.jsx";
import Navbar from "./Navbar.jsx";
import TelegramIcon from "@mui/icons-material/Telegram";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import UserPosts from "./UserPosts.jsx";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import linkifyContent from "../../utils/linkify.js";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SnakBar from "../SnakBar.jsx";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, styled } from "@mui/material";


const dialogStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,

  margin: "auto",
  width: "30vw",
  color: "#000",

  maxHeight: "60vh",

  //   overflow: "hidden",
  borderRadius: "8px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#F4F2EE",
};

const UserProfile = () => {
  const {
    isLogin,
    setIsLogin,
    setLoginDialog,
    loginDialog,
    currUserData,
    setMessages,
    actAs,
    setActAs,
    setIsSnakBar,
    setSelectCompanyForJob,
    setCurrConversationId,
    setLoading,
  } = useContext(AllContext);

  const { userId } = useParams();
  console.log(userId);
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const [follow, setFollow] = useState(false);
  const [connection, setConnection] = useState(false);
  const [pendinConnection, setPendingConnection] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [allPost, setAllPost] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [jobList, setJobList] = useState([]);
  const [snak, setSnak] = useState({ type: null, text: null });
  const [rewardDialog, setRewardDialog] = useState(false);
  const [rewardDetails, setRewardDetails] = useState({ email: "", name: "", amount: null, payment_method: null });

  const maxLength = 100;
  const getUserDataFunc = async () => {
    console.log("use trigger");
    let res = await getUserDataAccId(userId);
    console.log("this is users info", res.data.user);
    if (res.status === 200) {
      setUserData(res.data.user);
      console.log(isLogin);
      if (isLogin && currUserData) {
        console.log(currUserData._id);

        // follow
        if (
          res.data.user &&
          res.data.user.followers.find(
            (follower) => follower.id.toString() === currUserData._id.toString()
          )
        ) {
          setFollow(true);
        } else {
          setFollow(false);
        }

        // pending connection
        if (res.data.user.connectionRequests.length === 0) {
          console.log("lenght is", res.data.user.connectionRequests.length);
          setPendingConnection(false);
        }

        // connection req
        if (
          res.data.user &&
          res.data.user.connectionRequests.length !== 0 &&
          res.data.user.connectionRequests.some(
            (req) => req.user.toString() === currUserData._id.toString()
          )
        ) {
          setPendingConnection(true);
          console.log("check pending connection", pendinConnection);
        }

        // connection
        if (
          res.data.user &&
          res.data.user.connections.includes(currUserData._id)
        ) {
          setConnection(true);
          setPendingConnection(false);
        }
      }
    } else {
      console.log(res.data.message);
    }
  };

  const getAllJobFunc = async () => {
    if (!hasMore) return;

    let res = await getAllJobsAcc({
      what: "postedByUser",
      page,
      userId: userId,
    });

    if (res && res.status === 200) {
      console.log("this Jobs data is", res.data.allJobs);
      const jobs = res.data.allJobs;

      setJobList((prev) => [...prev, ...jobs]);

      if (jobs.length < 7) {
        setHasMore(false);
      }
    } else {
      console.log("somthing error");
    }
  };

  const deleteFunction = async (id) => {
    setIsSnakBar(true);
    let res = await deleteJob(id);
    if (res.status === 200) {
      setSnak({ type: "success", text: `${res.data.message}` });

      console.log("deleted");
      setJobList(jobList.filter((job) => job._id !== id));
    } else if (res.status === 201) {
      console.log("You are Not author To delete it");
      setSnak({ type: "error", text: `${res.data.message}` });
    } else {
      console.log("somthing error");
      setSnak({ type: "error", text: `${res.data.message}` });
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore) {
      // If user is near the bottom of the list, load more notifications
      setPage((prevPage) => prevPage + 1); // Move to the next page
    }
  };

  useEffect(() => {
    getAllJobFunc();
  }, [page]);

  useEffect(() => {
    console.log(
      `setFollow is ${follow}, setConnection is ${connection} & setPendingConnection is ${pendinConnection}`
    );
  }, [follow, connection, pendinConnection]);

  const sendConnectionReq = async (id) => {
    setIsSnakBar(true);

    let res = await sendConnect({ receiverId: id });
    if (res.status === 200) {
      setPendingConnection((prev) => true); // Guaranteed to use the latest state
      setConnection((prev) => true); // Guaranteed to use the latest state
      console.log("req send");
      if (currUserData && currUserData.following.includes(userId)) return;
      await sendNotification({
        recipient: userId,
        sender: currUserData._id,
        type: "connection_request",
        message: "you have new Connection Request From",
      });
    } else if (res.status === 201) {
      setSnak({ type: "error", text: `${res.data.message}` });
    }
    console.log(res.data);
  };

  const checkConnectionEachOtherFunction = async (data) => {
    setIsSnakBar(true);

    if (data.receiverType === "Company") return true;
    let res = await checkConnectionEachOther(data);
    if (res.status === 200) {
      console.log("you enable to msg");
      return true;
    } else if (res.status === 201) {
      console.log("you not .. enable to msg first connect please");
      setSnak({ type: "error", text: `${res.data}` });

      return false;
    }
  };

  const setConversationFunction = async (data) => {
    // console.log(await checkConnectionEachOtherFunction(data));
    // here logic of if connections done than msg other wise not in starting otherwise new conversation made
    if (await checkConnectionEachOtherFunction(data)) {
      let res = await setConversation(data);
      if (res.status === 200) {
        console.log(res.data);
        setCurrConversationId(res.data.id);

        let convId = res.data.id;

        let res2 = await getMsgAccConvId({
          convId,
          page: 1,
          limit: 15,
          whoId: currUserData && currUserData._id,
          whoType: "User",
        });
        if (res2.status === 200) {
          console.log("messages is", res2.data);
          setMessages(res2.data);
        }

        console.log("conversation id selected", convId);
        let res3 = await markAsRead({ convId, userId });
        if (res3.status === 200) {
          console.log("message seen by user");
        }

        console.log("connection set");

        setTimeout(() => {
          navigate("/message");
        }, 500);
      }
    }
  };


  const handleCheckoutReward = async () => {
    console.log(rewardDetails);
    setLoading(true);

    let res = await checkOutReward({ ...rewardDetails, userId: userData?._id });
    if (res.status === 200) {
      console.log(res.data);
      window.location.href = res.data.url;
    } else {
      console.log("somthing error");
    }

    setLoading(false);
  }



  useLayoutEffect(() => {
    getUserDataFunc();
    // if (isLogin) createNoti();
  }, [isLogin]);

  return (
    <div className='main-overview w-[100vw] bg-[#F4F2EE] h-auto'>
      <LoginDialog
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        setLoginDialog={setLoginDialog}
        loginDialog={loginDialog}
      />
      <Loader />
      <div className='main-overview-wrapper   max-w-[100vw]  overflow-x-hidden'>
        {/* Navbar Apper in All Social Routs */}
        <Navbar />
        {snak.type && <SnakBar type={snak.type} text={snak.text} />}

        <div className='main-display w-[80vw]   min-h-[100vh] h-fit flex justify-center   m-auto p-2  '>
          <div className='main-down mt-[60px]  w-[95%]  min-h-[70%]'>
            <div className='profile-wrapper-all bg-[#fff] border-2 shadow-sm border-gray-400 border-opacity-40 w-[65%] p-5 pl-10 rounded-md flex-row space-y-3  '>
              <div className='profil-pic'>
                <img
                  src={
                    userData && userData.profilePicture
                      ? userData.profilePicture
                      : "/blank.png"
                  }
                  className='min-w-[150px] border-2 
 border-gray-400 shadow-sm border-opacity-40 min-h-[150px]  rounded-full max-w-[150px] max-h-[150px] '
                  alt='profil pic'
                />
              </div>
              <div className='profil-details'>
                <p className='text-[#000] text-2xl font-semibold hover:bg-[#c2c2c2] w-fit cursor-pointer rounded-md'>
                  {userData ? userData.name : "Name"}&nbsp;&nbsp;&nbsp;
                  {userData && userData.role && (
                    <span className='text-[#9b9b9b] text-[15px]'>
                      {userData.role}
                    </span>
                  )}
                </p>
                {userData && userData.heading && (
                  <p className='text-[#252525] heading-para text-xl font-semibold  w-fit cursor-pointer rounded-md'>
                    {userData.heading}
                  </p>
                )}
                <p className='text-[#686868] mt-2 text-sm'>
                  {`${userData ? userData.city : ""}, ${userData ? userData.state : ""
                    }, ${userData ? userData.country : ""}`}
                </p>

                {userData && userData.website && userData.website.linkText ? (
                  <div className='flex space-x-1 mt-2 cursor-pointer'>
                    <a
                      href={userData.website && userData.website.link}
                      target='_blank'
                      rel='noreferrer'
                    >
                      <p className='text-[#352eff] text-sm hover:underline'>
                        {userData.website && userData.website.linkText}
                      </p>
                    </a>
                    <OpenInNewIcon
                      fontSize='small'
                      className='text-[#352eff]'
                      onClick={() =>
                        window.open(userData.website && userData.website.link)
                      }
                    />
                  </div>
                ) : (
                  userData &&
                  userData.website &&
                  userData.website.link(
                    <div className='flex space-x-1 mt-2 cursor-pointer'>
                      <a
                        href={
                          userData &&
                          userData.website &&
                          userData.website.link &&
                          userData.website.link
                        }
                      >
                        {userData &&
                          userData.website &&
                          userData.website.link &&
                          userData.website.link}
                      </a>
                      <OpenInNewIcon
                        fontSize='small'
                        className='text-[#352eff]'
                        onClick={() =>
                          window.open(userData.website && userData.website.link)
                        }
                      />
                    </div>
                  )
                )}
                <p className='text-[#686868] mt-2 text-sm'>
                  {userData ? userData.followers.length : ""} followers
                </p>
              </div>
              {currUserData &&
                userData &&
                currUserData._id !== userData._id && (
                  <div className='follow-s flex space-x-2'>
                    <button
                      onClick={async () => {
                        if (isLogin) {
                          let res = await sendFollowReq({
                            receiverId: userData._id,
                            receverType: "User",
                            senderId: currUserData._id,
                            senderType: "User",
                          });
                          setFollow(!follow);

                          console.log(res.data);
                        } else {
                          // setLoginDialog(true);
                        }
                      }}
                      className='p-1 w-[100px]  rounded-full  bg-[#0A66C2] text-[#fff] hover:bg-[#004182] hover:text-[] '
                    >
                      {follow ? "UnFollow" : "Follow"}
                    </button>
                    <button
                      onClick={() => {
                        setConversationFunction({
                          receiverId: userData && userData._id,
                          senderType:
                            actAs && actAs.type === "company"
                              ? "Company"
                              : "User",
                          senderId: actAs && actAs.id,
                          receiverType: "User",
                        });
                      }}
                      className='p-1 w-[110px] flex space-x-1 rounded-full border-[2px] border-[#0A66C2] bg-[] text-[#0A66C2] hover:border-[#004182] hover:text-[#004182] '
                    >
                      <TelegramIcon />
                      <span>Messege</span>
                    </button>
                    {!connection && !pendinConnection && (
                      <button
                        onClick={() => {
                          sendConnectionReq(userData._id);
                          getUserDataFunc();
                        }}
                        className='p-1 w-[110px] space-x-1 flex justify-center rounded-full border-[2px] border-[#0A66C2] bg-[] text-[#0A66C2] hover:border-[#004182] hover:text-[#004182]'
                      >
                        <PersonAddAltIcon />
                        <span>Connect</span>
                      </button>
                    )}

                    {pendinConnection && (
                      <button className='p-1 w-[110px] space-x-1 flex justify-center rounded-full border-2 border-[#444444] bg-[] text-[#444444] hover:border-[#1b1b1b] hover:text-[#1b1b1b]'>
                        <AccessTimeIcon />
                        <span>Pending</span>
                      </button>
                    )}

                  </div>
                )}
              <button
                onClick={() => {
                  setRewardDialog(true);
                }}
                className='p-1 w-fit pr-2 flex space-x-1 rounded-full border-[2px] border-[#0A66C2] bg-[] text-[#0A66C2] hover:border-[#004182] hover:text-[#004182] '
              >
                <AttachMoneyIcon />
                <span>Give Reward </span>
              </button>
            </div>


            {/* Reward Dialog Start Here */}

            <Dialog
              open={rewardDialog}
              PaperProps={{
                sx: {
                  ...dialogStyle,
                },
              }}
            >

              <div>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleCheckoutReward();

                }
                }
                  className="flex justify-center items-center"
                >
                  <div className="w-[70%] ">

                    <input type="text" required name="name"
                      placeholder="Enter Your Name"
                      className="border-2  rounded-full bg-white border-black  mt-[3px] border-opacity-70 placeholder:text-[#908282]  w-[100%] text-black h-[30px] p-5"
                      onChange={(e) => {
                        setRewardDetails({ ...rewardDetails, name: e.target.value });
                      }}
                    />
                    <input type="email" required name="email"
                      placeholder="Enter Your Email"
                      className="border-2  rounded-full bg-white border-black  mt-[3px] border-opacity-70 placeholder:text-[#908282]  w-[100%] text-black h-[30px] p-5"
                      onChange={(e) => {
                        setRewardDetails({ ...rewardDetails, email: e.target.value });
                      }}
                    />

                    <input type="number" min={10} step={"any"} required name="reward_amount"
                      placeholder="Enter reward amount"
                      className="border-2  rounded-full bg-white border-black  mt-[3px] border-opacity-70 placeholder:text-[#908282]  w-[100%] text-black h-[30px] p-5"
                      onChange={(e) => {
                        let valuee = e.target.value;
                        if (valuee > 0 && valuee !== "" && valuee !== null) {
                          console.log(valuee);
                          setRewardDetails({ ...rewardDetails, amount: valuee });
                        }
                      }}
                    />
                    <div className="flex justify-center items-center space-x-5 mt-5">
                      <label className="flex items-center space-x-2">
                        <input type="radio" required name="payment_method" value="paypal" onChange={(e) => {
                          setRewardDetails({ ...rewardDetails, payment_method: e.target.value });
                        }} />
                        <span className="text-black">Paypal</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" required name="payment_method" value="stripe" onChange={(e) => {
                          setRewardDetails({ ...rewardDetails, payment_method: e.target.value });
                        }} />
                        <span className="text-black">Stripe</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" required name="payment_method" value="square" onChange={(e) => {
                          setRewardDetails({ ...rewardDetails, payment_method: e.target.value });
                        }} />
                        <span className="text-black">Square</span>
                      </label>
                    </div>
                    <button
                      type="submit"
                      className='p-2 w-full mt-3 rounded-full bg-[#0A66C2] text-white hover:bg-[#004182] font-semibold'
                    >
                      Pay Reward
                    </button>
                    <p className="text-[10px] text-right mt-5">* 50% platform fee will be charged</p>
                    <p className="text-[15px] text-center font-semibold mt-5">After Successful Payment, reciept will be sent to your email</p>
                  </div>

                </form>
              </div>

              <div
                className='absolute top-[20px] right-[30px] text-2xl cursor-pointer'
                onClick={() => {
                  setRewardDialog(false);
                }}
              >
                <CloseIcon />
              </div>
            </Dialog>




            {userData &&
              userData.education &&
              userData.education.length > 0 && (
                <div
                  className='profile-wrapper-all bg-[#fff] border-2 
 border-gray-400 border-opacity-40 mt-3 w-[65%] p-3 pl-10 rounded-md flex-row space-y-3  '
                >
                  <p className='text-[#000] text-xl font-semibold'>Education</p>
                  {userData && userData.education[0] ? (
                    userData.education.map((edu) => {
                      return (
                        <div
                          key={userData._id}
                          className='profile-edu bg-[#F4F2EE] p-2 pl-3 rounded-md w-[80%] flex  items-center'
                        >
                          <div>
                            <p className='text-[#000]'>{edu.degree}</p>

                            <p className='text-[#686868] -mb-1 text-sm'>
                              {edu.university}
                            </p>
                            <p className='text-[#686868] -mb-1 text-sm'>{`${edu.startDate.year} - ${edu.endDate.year}`}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className='text-[#000]'>No Any Education Here</p>
                  )}
                </div>
              )}

            {userData && userData.skills && userData.skills[0] && (
              <div className=' bg-white w-[65%] mt-2 p-4 rounded-md border-2 border-gray-400 border-opacity-40'>
                <p className='text-[#000] text-xl font-semibold'>Skills</p>
                {userData &&
                  userData.skills &&
                  userData.skills.length > 0 &&
                  userData.skills.map((skill, index) => {
                    return (
                      <div
                        className='flex p-2 items-center space-x-2 border-b-2 border-gray-400 border-opacity-40'
                        key={index}
                      >
                        <p className='text-[#686868] hover:underline cursor-pointer text-sm'>
                          {skill}
                        </p>
                      </div>
                    );
                  })}
              </div>
            )}
            {/* jobs */}
            {jobList && jobList.length > 0 && (
              <div className='job-applications border-2 border-gray-400 mt-4 bg-white w-[65%] mb-10 rounded-md border-opacity-40'>
                <div className='p-3 font-semibold text-xl'>
                  <p>Jobs Posted</p>
                </div>

                <div
                  onScroll={handleScroll}
                  className='flex-row justify-center   overflow-y-scroll max-h-[70vh]  min-h-[70vh] items-center'
                >
                  {jobList &&
                    jobList.length > 0 &&
                    jobList.map((job) => (
                      <div
                        key={job._id}
                        className='w-[100%] flex items-center cursor-pointer justify-between hover:bg-gray-200  p-5 '
                      >
                        <div className='flex gap-4 '>
                          <div
                            onClick={() => {
                              navigate(`/job/view/${job._id}`);
                            }}
                            className=''
                          >
                            <img
                              src={
                                job.createdBy?.company?.profilePicture ||
                                "/blank.png"
                              }
                              className='min-w-[70px] rounded-sm max-w-[70px] min-h-[70px] max-h-[70px]'
                              alt=''
                            />
                          </div>
                          <div
                            onClick={() => {
                              navigate(`/job/view/${job._id}`);
                            }}
                            className='relative top-[-7px] min-w-[250px] max-w-[150px]'
                          >
                            <p className='font-semibold text-xl text-blue-700 hover:underline'>
                              {job.title}
                            </p>
                            <p>{job.createdBy?.company?.name}</p>
                            <p className=' text-gray-500'>
                              {job.location} ({job.workplace})
                            </p>
                            <p>{job.salary}$/year</p>
                            <p className='text-green-700'>
                              {job.applicants?.length || "0"} applicants
                            </p>
                          </div>
                          {currUserData &&
                            currUserData.company?.length > 0 &&
                            currUserData.company.some(
                              (company) =>
                                company._id === job.createdBy?.company._id
                            ) && (
                              <div className='relative'>
                                <div className='flex gap-3'>
                                  <button
                                    onClick={() => {
                                      navigate(`/job/edit/${job._id}`);
                                    }}
                                    aria-label='edit job'
                                    className='
                            flex
                            items-center
                            bg-white
                            text-yellow-700
                            border border-yellow-700
                            hover:text-white
                            hover:bg-yellow-700
                            focus:outline-none
                            focus:ring-2
                            focus:ring-offset-2
                            focus:ring-yellow-700
                            rounded-md
                            px-4
                            py-2
                          '
                                  >
                                    <EditIcon />
                                    <p className='ml-2'>Edit job</p>
                                  </button>
                                  <button
                                    onClick={() => deleteFunction(job._id)}
                                    aria-label='delete job'
                                    className='
                          flex
                          items-center
                          bg-white
                          text-red-700
                          border border-red-700
                          hover:text-white
                          hover:bg-red-700
                          focus:outline-none
                          focus:ring-2
                          focus:ring-offset-2
                          focus:ring-red-700
                          rounded-md
                          px-4
                          py-2
                        '
                                  >
                                    <DeleteIcon />
                                    <p className='ml-2'>Delete job</p>
                                  </button>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    ))}

                  {jobList && jobList.length === 0 && (
                    <>
                      <div className='flex justify-center items-center'>
                        <img
                          src='/no-data.jpg'
                          alt=''
                          className='min-w-[300px] mt-5 max-w-[300px] min-h-[300px] max-h-[300px]'
                        />
                      </div>
                      <p className='mt-2 text-center'>
                        No Any Job Posted by comapny
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            <div
              className='profile-wrapper-all bg-[#fff] border-2 
 border-gray-400 border-opacity-40 mt-3 w-[65%] p-3   rounded-md flex  items-center space-y-3  '
            >
              <div className=' w-[100%]'>
                <p className='text-[#000] text-xl font-semibold'>Posts</p>
                <UserPosts
                  allPost={allPost}
                  setAllPost={setAllPost}
                  userData={userData}
                  setFollow={setFollow}
                  follow={follow}
                  what={"another"}
                />
              </div>
            </div>
            {userData && userData.about && (
              <div className=' bg-white w-[65%] mt-2 p-4 rounded-md border-2 border-gray-400 border-opacity-40'>
                <p className='text-[#000] text-xl font-semibold'>About Me</p>
                <div className='p-2'>
                  <pre
                    className=' text-wrap'
                    dangerouslySetInnerHTML={{
                      __html: !showMore
                        ? linkifyContent(
                          userData &&
                          userData.about &&
                          userData.about.substring(0, maxLength)
                        )
                        : linkifyContent(
                          userData && userData.about && userData.about
                        ),
                    }}
                  ></pre>
                  {userData.about.length > maxLength && (
                    <button
                      onClick={() => setShowMore(true)}
                      className='text-blue-600 cursor-pointer mt-2'
                    >
                      {!showMore && "more..."}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div >
    </div >
  );
};

export default UserProfile;
