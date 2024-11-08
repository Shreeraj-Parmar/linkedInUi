import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useContext,
  useRef,
} from "react";
import { AllContext } from "../../context/UserContext.jsx";
import { Skeleton } from "@mui/material";

// icons
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import FavoriteIcon from "@mui/icons-material/Favorite";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import PostDialog from "../../Post Compo/PostDialog";
import AddIcon from "@mui/icons-material/Add";
import {
  getAllPostFromDB,
  sendCommentData,
  getUserData,
  toggleLikeOnPost,
  getCommentAccPost,
  getCommentCount,
  sendFollowReq,
  checkIfFollowingUser,
  sendNotification,
} from "../../services/api.js";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import Slider from "react-slick";
import { Card, CardMedia, Box } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import UpdatePostDialog from "./UpdatePostDialog.jsx";
import linkifyContent from "../../utils/linkify.js";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChangeAs from "../../Post Compo/ChangeAs.jsx";
import SnakBar from "../SnakBar.jsx";

const PostView = ({
  imgUrl,
  setLoginDialog,
  loginDialog,
  isLogin,

  setLoading,
}) => {
  const {
    setCurrUserData,
    currUserData,
    changeAsDialog,
    setChangeAsDialog,
    setCurrMenu,
    lightMode,
    actAs,
    setActAs,
    setIsSnakBar,
  } = useContext(AllContext);
  const [postDialog, setPostDialog] = useState(false);
  const [commentBoxOpen, setCommentBoxOpen] = useState({});
  const [allPost, setAllPost] = useState([]);
  const [likes, setLikes] = useState({});
  const [isDisabledPostBtn, setIsDisabledPostBtn] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [commentsByPost, setCommentsByPost] = useState({});
  const commentInputRef = useRef();
  const [commentCount, setCommentCount] = useState({});
  const [followStatus, setFollowStatus] = useState({});
  const [postSkeleton, setPostSkeleton] = useState(true);
  const [selectedPostForUpdate, setSelectedPostForUpdate] = useState(null);
  const navigate = useNavigate();
  const [page, setPage] = useState(1); // For pagination
  const [hasMore, setHasMore] = useState(true); // For checking if there are more notifications to load
  const limit = 3; // Number of notifications to load at a time
  const videoRef = useRef(null);
  const [showAllMedia, setShowAllMedia] = useState({});
  const [isStatus, setIsStatus] = useState(false);
  const [isFollowStatus, setIsFollowStatus] = useState(false);
  const [updatePostDialog, setUpdatePostDialog] = useState(false);
  const [snak, setSnak] = useState({ type: null, text: null });

  // loading state:
  const [loadingPost, setLoadingPost] = useState(true); // Loading state for posts
  const [loadingComments, setLoadingComments] = useState({}); // Loading state for

  // readmore feature in post
  const [readMore, setReadMore] = useState({});

  const CustomPrevArrow = (props) => {
    const { onClick } = props;
    return (
      <div
        className='slick-arrow slick-prev'
        onClick={onClick}
        style={{ zIndex: 1 }}
      >
        &#10094; {/* Left arrow icon */}
      </div>
    );
  };

  const CustomNextArrow = (props) => {
    const { onClick } = props;
    return (
      <div
        className='slick-arrow slick-next'
        onClick={onClick}
        style={{ zIndex: 1 }}
      >
        &#10095; {/* Right arrow icon */}
      </div>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />, // Custom previous arrow
    nextArrow: <CustomNextArrow />, // Custom next arrow
  };

  useEffect(() => {
    setTimeout(() => {
      setPostSkeleton(false);
    }, 2000);
    const videoElement = videoRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // When the video is in view, play it
            videoElement.play();
          } else {
            // When the video goes out of view, pause it
            videoElement.pause();
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the video is in view
      }
    );

    if (videoElement) {
      observer.observe(videoElement);
    }

    // Cleanup observer when component unmounts
    return () => {
      if (videoElement) {
        observer.unobserve(videoElement);
      }
    };
  }, []);

  const handleFollowClick = async (receiver, type) => {
    if (!isLogin) {
      setLoginDialog(true); // Show login dialog if user is not logged in
      return;
    }
    setIsFollowStatus(false);
    let res = await sendFollowReq({
      receiverId: receiver,
      receverType: type,
      senderId: actAs && actAs.id,
      senderType: actAs && actAs.type === "company" ? "Company" : "User",
    });
    if (res.status === 200) {
      setFollowStatus((prev) => ({
        ...prev,
        [receiver]: {
          ...prev[receiver],
          [actAs.id]: !prev[receiver][actAs.id], // Set the like status to true for the current user or company
        },
      }));
      console.log(res.data.message);
      if (res.data.message.startsWith("Now you are following")) {
        await sendNotification({
          recipient: {
            id: receiver,
            type: type,
          },
          sender: {
            id: actAs && actAs.id,
            type: actAs && actAs.type === "company" ? "Company" : "User",
          },
          type: "follow",
          message: "you have new follower",
        });
      }
      // Toggle the follow status locally
    } else {
      setSnak({
        type: "error",
        text: "Error while following/unfollowing!",
      });
      console.error("Error while following/unfollowing:", res.data.message);
    }
  };

  const enableDisableCommentPostBtn = () => {
    // move to onChange function
    let hii = commentInputRef.current.value.trim();
    if (hii === "") {
      setIsDisabledPostBtn(true);
    } else {
      setIsDisabledPostBtn(false);
    }
  };

  const handleCommentClick = (postId) => {
    setCommentBoxOpen((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const postFunc = async (page, limit) => {
    setIsStatus(true);
    setIsFollowStatus(true);
    setLoadingPost(true); // Start loading
    let res = await getAllPostFromDB(page, limit); // Fetch posts from the database

    if (res.status === 200) {
      // Check if the response is successful
      // let res.data.allPosts = res.data.allPosts.sort((a, b) => {
      //   return new Date(b.createdAt) - new Date(a.createdAt); // Sort posts by newest first
      // });
      console.log("Sorted posts:", res.data.allPosts);

      // Update all posts state with the newly fetched and sorted posts
      setAllPost((prevPosts) => [...prevPosts, ...res.data.allPosts]);
      let readMoreForAllPost = res.data.allPosts.map((post) => ({
        [post._id]: false,
      }));
      setReadMore((prevReadMore) => ({
        ...prevReadMore,
        ...readMoreForAllPost,
      }));

      res.data.allPosts.map((post) => {
        // Check if the current user has liked the post
        setCommentCount((prevCount) => ({
          ...prevCount,
          [post._id]: post.comments.length,
        }));
      });

      // to show 4 or more image with slider

      let ShowAllMediasData = res.data.allPosts.reduce((acc, post) => {
        acc[post._id] = false; // Set the value to false for each post._id
        return acc;
      }, {}); // Initialize an empty object

      console.log("ShowAllMediasData", ShowAllMediasData);

      setShowAllMedia((prev) => ({
        ...prev,
        ...ShowAllMediasData,
      }));

      // Check if there are more posts to load
      if (res.data.allPosts.length < limit) {
        setHasMore(false); // No more posts to load
      }

      // checkFollowStatus(); // Check follow status
    } else {
      console.error("Failed to fetch posts:", res); // Handle error
    }

    setLoadingPost(false); // Stop loading
  };

  const likeUpdateStatus = () => {
    if (currUserData) {
      const newLikes = {}; // Store the likes for the newly loaded posts
      allPost.forEach((post) => {
        // Check if the current user has liked the post
        const userLikeStatus = post.likedBy.some(
          (like) => like.type === "User" && like.id === currUserData._id
        );

        // Initialize likes for this post
        newLikes[post._id] = {
          [currUserData._id]: userLikeStatus,
        };

        if (currUserData.company && currUserData.company.length > 0) {
          // Add likes for each company the user represents
          const companyLikes = currUserData.company.reduce((acc, company) => {
            acc[company._id] = post.likedBy.some(
              (like) => like.type === "Company" && like.id === company._id
            );
            return acc;
          }, {});
          newLikes[post._id] = {
            ...newLikes[post._id],
            ...companyLikes,
          };
        }
      });

      // Use functional setLikes to merge with the existing likes state
      setLikes((prevLikes) => ({
        ...prevLikes, // Spread the previous likes to keep them
        ...newLikes, // Add the new likes from the newly fetched posts
      }));
      console.log("Likes initialized here please check it:", newLikes);
    } else {
      setLikes({}); // User is not logged in
    }
  };

  const folowStatusUpdate = () => {
    if (currUserData) {
      const newFollows = {}; // Store the likes for the newly loaded posts
      allPost.forEach((post) => {
        // Check if the current user has liked the post
        const userFollowStatus = post.createdBy.id.followers.some(
          (like) => like.type === "User" && like.id === currUserData._id
        );

        // Initialize likes for this post
        newFollows[post.createdBy.id._id] = {
          [currUserData._id]: userFollowStatus,
        };

        if (currUserData.company && currUserData.company.length > 0) {
          // Add likes for each company the user represents
          const companyFollows = currUserData.company.reduce((acc, company) => {
            acc[company._id] = post.createdBy.id.followers.some(
              (like) => like.type === "Company" && like.id === company._id
            );
            return acc;
          }, {});
          newFollows[post.createdBy.id._id] = {
            ...newFollows[post.createdBy.id._id],
            ...companyFollows,
          };
        }
      });

      // Use functional setLikes to merge with the existing likes state
      setFollowStatus((prevLikes) => {
        const newFollowStatus = { ...prevLikes }; // Start with the previous likes
        Object.keys(newFollows).forEach((postId) => {
          if (!newFollowStatus[postId]) {
            newFollowStatus[postId] = newFollows[postId];
          }
        });
        return newFollowStatus;
      });
    } else {
      setFollowStatus({}); // User is not logged in
    }
  };

  useEffect(() => {
    console.log("followed status", followStatus);
  }, [followStatus]);

  useEffect(() => {
    if (isStatus === true) {
      likeUpdateStatus();
    }

    if (isFollowStatus === true) {
      folowStatusUpdate();
    }
  }, [allPost, isStatus, isFollowStatus]);

  useLayoutEffect(() => {
    getData();
  }, [isLogin]);

  useEffect(() => {
    if (hasMore) {
      postFunc(page, limit);
    }
  }, [page]);

  // get user data
  const getData = async () => {
    let res = await getUserData();
    console.log("calling func to get currUserData is", res.data);
    setCurrUserData(res.data.user);
  };

  // for like update

  const handleLike = async (postId, receiver, type) => {
    if (!isLogin) {
      setLoginDialog(true); // Show login dialog if user is not logged in
      return;
    }
    setIsStatus(false);

    console.log("Current user data:", currUserData);
    console.log("Acting as:", actAs);

    // Send request to toggle like on the post
    let res = await toggleLikeOnPost({
      postId: postId,
      whoLiked: actAs.id,
      type: actAs.type === "company" ? "Company" : "User",
    });

    if (res.status === 200) {
      console.log(res.data.message);

      // Check if the post is now liked or unliked (FinalLikeStatus from server)
      if (res.data.FinalLikeStatus) {
        // Increment like count on the post
        setAllPost((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, likeCount: post.likeCount + 1 }
              : post
          )
        );

        // Update likes state
        setLikes((prevLikes) => ({
          ...prevLikes,
          [postId]: {
            ...prevLikes[postId],
            [actAs.id]: true, // Set the like status to true for the current user or company
          },
        }));
      } else {
        // Decrement like count on the post
        setAllPost((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, likeCount: post.likeCount - 1 }
              : post
          )
        );

        // Update likes state
        setLikes((prevLikes) => ({
          ...prevLikes,
          [postId]: {
            ...prevLikes[postId],
            [actAs.id]: false, // Set the like status to false for the current user or company
          },
        }));
      }

      // You can add a notification here if needed

      await sendNotification({
        recipient: {
          id: receiver,
          type: type,
        },
        sender: {
          id: actAs && actAs.id,
          type: actAs && actAs.type === "company" ? "Company" : "User",
        },
        type: "like",
        message: "you have new like",
      });
    } else {
      console.error("Error updating like status on server", res.data.message);
    }
  };

  // get all comment acc id
  const getAllCommentsFunc = async (id) => {
    setLoadingComments((prevComment) => ({ ...prevComment, [id]: true }));
    let res = await getCommentAccPost(id);
    if (res && res.status === 200) {
      // Update state with comments

      setCommentsByPost((prev) => {
        const newComments = {
          ...prev,
          [id]: [...res.data.commentsList], // Store comments under the respective post ID
        };
        newComments[id] = newComments[id].reverse();
        console.log("new comments is here", newComments); // Log the new comments state
        return newComments; // Return the updated state
      });
    } else {
      console.error("Failed to fetch comments:", res); // Log an error message if API call fails
    }
    setLoadingComments((prevComment) => ({ ...prevComment, [id]: false }));
  };

  const handleScrollPost = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (
      scrollTop + clientHeight >= scrollHeight - 10 &&
      hasMore &&
      !loadingPost
    ) {
      // If user is near the bottom of the list, load more notifications
      setPage((prevPage) => prevPage + 1); // Move to the next page
    }
  };

  // send CommentData to the Backend
  const handleCommentPost = async (id, userId, type) => {
    if (!isLogin) {
      setLoginDialog(true); // Show login dialog if user is not logged in
      return;
    }
    getData();
    let res = await sendCommentData({
      postId: id,
      whoCommented: actAs.id,
      type: actAs.type === "company" ? "Company" : "User",
      text: commentText,
    });
    if (res.status === 200) {
      const newComment = {
        text: commentText,
        post: id,
        createdBy: {
          id: {
            _id: actAs.id,
            name:
              actAs.type === "user"
                ? currUserData.name
                : currUserData.company.find((com) => com._id === actAs.id).name,
            profilePicture:
              actAs.type === "user"
                ? currUserData.profilePicture || "/blank.png"
                : currUserData.company.find((com) => com._id === actAs.id)
                    .profilePicture || "/blank.png",
            city: currUserData.city,
          },
        },
        createdAt: new Date().toISOString(),
      };

      // Optimistically update the comments UI
      setCommentsByPost((prev) => ({
        ...prev,
        [id]: [newComment, ...(prev[id] || [])], // Add the new comment at the start of the comments array
      }));
      console.log(res.data.message);
      setCommentText("");

      if (res.data.message === "Comment Added")
        setCommentCount((prevCount) => ({
          ...prevCount,
          [id]: prevCount[id] ? prevCount[id] + 1 : 1,
        }));
      if (actAs.id !== userId)
        await sendNotification({
          recipient: {
            id: userId,
            type: type,
          },
          sender: {
            id: actAs && actAs.id,
            type: actAs && actAs.type === "company" ? "Company" : "User",
          },
          type: "comment",
          message: "you have new comment on post",
        });
      getAllCommentsFunc(id);
    } else {
      setSnak({
        type: "error",
        text: res.data.message,
      });
      console.log("error somthing :", res.data.message);
      setCommentText("");
    }
    console.log("before comment text : ", commentText);
    setCommentText("");

    console.log("after comment text : ", commentText);
  };

  // Helper function to detect URLs and convert them into clickable links

  return (
    <div
      onScroll={handleScrollPost}
      className='post-wrapper max-h-[100vh]  w-[100%]  overflow-y-scroll  flex-row space-y-'
    >
      {snak.type && <SnakBar type={snak.type} text={snak.text} />}

      <PostDialog
        postDialog={postDialog}
        setPostDialog={setPostDialog}
        setAllPost={setAllPost}
        currUserData={currUserData}
        setShowAllMedia={setShowAllMedia}
        imgUrl={imgUrl}
        setIsSnakBar={setIsSnakBar}
      />
      <div className=' flex justify-center   items-center'>
        <div
          className={`write-post text-[#DBDBDC] bg-[#1B1F23] w-[97%]  max-h-[10vh] h-[10vh] rounded-md p-4 pl-6 pr-6 ${
            lightMode && " bg-white text-black"
          }  ${lightMode && " border-2 border-gray-400 border-opacity-40"}  `}
        >
          <div
            className={`write-post-wrapper h-[100%]  flex justify-center items-center `}
          >
            <div className='write-post-left w-[10%]'>
              <img
                src={imgUrl || "/blank.png"}
                alt='your profile picture'
                className='rounded-full border border-gray-400 border-opacity-40 min-w-[55px] max-w-[55px] min-h-[55px] max-h-[55px]'
              />
            </div>
            <div
              className={`write-post-right w-[90%] p-5 h-[50px] border border-[#DBDBDC] rounded-full flex justify-start items-center hover:bg-[#DBDBDC] hover:bg-opacity-10 cursor-pointer ${
                lightMode &&
                " border border-black border-opacity-50 shadow-sm hover:bg-[#cecece]"
              }`}
              onClick={() => {
                if (!isLogin) {
                  setLoginDialog(true);
                  return;
                }

                setPostDialog(true);
              }}
            >
              <p className='write-post-btn'>Start to Write Post</p>
            </div>
          </div>
        </div>
      </div>
      {/* Show All Posts */}
      <div
        className={`posts text-[#DBDBDC]    w-[100%] mt-1  p-1 rounded-md ${
          lightMode && "  text-black"
        }`}
      >
        <div className=' h-[100%]  p-2  flex-row space-y-3  '>
          {/* Skeleton Of Posts */}
          {/* map post logic here */}

          {postSkeleton && (
            <div className='flex justify-center'>
              <div
                className={`post bg-[#1B1F23]   p-5  rounded-md w-[100%] h-fit space-y-2 ${
                  lightMode &&
                  " bg-white border-2 shadow-sm border-gray-400 border-opacity-40"
                }`}
              >
                <div className='post-des flex    w-[100%] space-x-2'>
                  <Skeleton
                    variant='circular'
                    width={55}
                    height={55}
                    className='rounded-full'
                  />
                  <div className='heading-post  lg:min-w-[200px] flex-row space-y-[-5px]'>
                    <Skeleton
                      variant='text'
                      width={150}
                      height={20}
                      className=' rounded-md'
                    />
                    <Skeleton
                      variant='text'
                      width={100}
                      height={15}
                      className=' rounded-md mt-1'
                    />
                    <Skeleton
                      variant='text'
                      width={150}
                      height={15}
                      className=' rounded-md mt-1'
                    />
                  </div>
                </div>
                <div className='post-text w-[100%]'>
                  <div>
                    <Skeleton
                      variant='rectangular'
                      width='100%'
                      height={100}
                      className='rounded-md mt-2'
                    />
                  </div>
                </div>

                <div className='post-image w-[100%] mt-2 flex justify-center items-center'>
                  <Skeleton
                    variant='rectangular'
                    width='95%'
                    height={300}
                    className='rounded-md mt-2'
                  />
                </div>

                <div className='flex justify-between'>
                  <Skeleton
                    variant='text'
                    width={50}
                    height={15}
                    className=' rounded-md mt-1'
                  />
                  <Skeleton
                    variant='text'
                    width={70}
                    height={15}
                    className=' rounded-md mt-1'
                  />
                </div>
                <div className='divider'></div>

                <div className='like-comment'>
                  <div className='like-comment-wrapper flex w-[50%]  items-center space-x-5 p-2'>
                    <div
                      className={`like flex space-x-1 cursor-pointer ${
                        lightMode && "hover:bg-[#F4F2EE] "
                      }  hover:bg-[#293138] p-2 rounded-md`}
                    >
                      <Skeleton
                        variant='text'
                        width={50}
                        height={15}
                        className=' rounded-md mt-1'
                      />
                    </div>
                    <div
                      className={`comment flex space-x-1 ${
                        lightMode && "hover:bg-[#F4F2EE] "
                      }  cursor-pointer hover:bg-[#293138] p-2 rounded-md`}
                    >
                      <Skeleton
                        variant='text'
                        width={50}
                        height={15}
                        className=' rounded-md mt-1'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {allPost && !postSkeleton && allPost.length > 0
            ? allPost.map((post) => {
                // Display truncated post content if longer than 100 characters
                const truncatedContent =
                  post.text && post.text.length > 100
                    ? post.text.substring(0, 100) + "..."
                    : post.text;

                return (
                  <div className='flex justify-center' key={post._id}>
                    <div
                      className={`post bg-[#1B1F23] p-5 rounded-md w-[100%] h-fit space-y-2 ${
                        lightMode &&
                        "bg-white border-2 shadow-sm border-gray-400 border-opacity-40"
                      }`}
                    >
                      <div className='post-des flex w-[100%] space-x-2'>
                        <img
                          src={
                            post.createdBy?.id?.profilePicture || "/blank.png"
                          }
                          alt='who posted this post'
                          className='w-[9%] h-[55px] rounded-full'
                        />
                        <div className='heading-post lg:min-w-[400px]  flex-row space-y-[-5px]'>
                          <p
                            onClick={() => {
                              setCurrMenu("");
                              setTimeout(() => {
                                navigate(
                                  post.createdBy?.type === "User"
                                    ? `/user/${post.createdBy?.id._id}`
                                    : `/company/${post.createdBy?.id._id}`
                                );
                              }, 500);
                            }}
                            className='hover:underline hover:text-blue-500 cursor-pointer'
                          >
                            {post.createdBy?.id?.name || "Unknown"}
                          </p>
                          <p className='text-[#959799]  text-[15px]'>
                            {post.createdBy && post.createdBy.id.heading
                              ? post.createdBy.id.heading.length > 60
                                ? post.createdBy.id.heading.slice(0, 60) + "..."
                                : post.createdBy.id.heading
                              : post.createdBy?.id.city ||
                                "No information available"}
                          </p>
                          <p className='text-[#959799] text-sm'>
                            {moment(post.createdAt).fromNow()}
                          </p>
                        </div>
                        {currUserData &&
                        post.createdBy?.id._id !== currUserData._id ? (
                          <div className='follow-btn min-w-[100px] p-2 relative lg:left-[4rem]'>
                            <button
                              onClick={() => {
                                handleFollowClick(
                                  post.createdBy?.id._id,
                                  post.createdBy?.type
                                );
                              }}
                              className={`p-2 rounded-md ${
                                lightMode &&
                                "text-[#004182] font-semibold bg-[#fff] hover:bg-[#EBF4FD]"
                              }`}
                            >
                              {actAs &&
                              followStatus[post.createdBy?.id._id] &&
                              followStatus[post.createdBy?.id._id][actAs.id]
                                ? "Following"
                                : "+ Follow"}
                            </button>
                          </div>
                        ) : (
                          !isLogin && (
                            <div className='follow-btn p-2 relative lg:left-[70px]'>
                              <button
                                onClick={() => {
                                  setLoginDialog(true);
                                }}
                                className={`p-2 rounded-md text-[#AAD6FF] hover:bg-[#1F2F41] ${
                                  lightMode &&
                                  "text-[#004182] font-semibold bg-[#fff] hover:bg-[#EBF4FD]"
                                }`}
                              >
                                +Follow
                              </button>
                            </div>
                          )
                        )}
                        {currUserData &&
                          post.createdBy?.id._id === currUserData._id && (
                            <div className='follow-btn p-2 relative lg:left-[100px] '>
                              {updatePostDialog && (
                                <UpdatePostDialog
                                  setUpdatePostDialog={setUpdatePostDialog}
                                  setShowAllMedia={setShowAllMedia}
                                  setAllPost={setAllPost}
                                  snak={snak}
                                  updatePostDialog={updatePostDialog}
                                  selectedPostForUpdate={selectedPostForUpdate}
                                  setSelectedPostForUpdate={
                                    setSelectedPostForUpdate
                                  }
                                  actAs={actAs}
                                  setSnak={setSnak}
                                  setIsSnakBar={setIsSnakBar}
                                />
                              )}
                              <EditIcon
                                onClick={() => {
                                  setUpdatePostDialog(true);
                                  setSelectedPostForUpdate(post);
                                }}
                                fontSize='medium'
                                className='text-[#3c3c3c] hover:text-blue-500 cursor-pointer'
                              />
                            </div>
                          )}
                      </div>
                      <div className='post-text w-[100%]'>
                        <div className=''>
                          <pre
                            dangerouslySetInnerHTML={{
                              __html: readMore[post._id]
                                ? linkifyContent(post.text)
                                : linkifyContent(truncatedContent),
                            }}
                            className='w-[90%] text-wrap mt-2 inline'
                          ></pre>
                          &nbsp;
                          {post.text.length > 100 && (
                            <button
                              className='text-blue-500'
                              onClick={() => {
                                setReadMore((prev) => ({
                                  ...prev,
                                  [post._id]: !prev[post._id],
                                }));
                              }}
                            >
                              {readMore && readMore[post._id]
                                ? "Show Less"
                                : "more..."}
                            </button>
                          )}
                        </div>
                      </div>

                      {post.mediaUrls &&
                        post.mediaUrls.length > 0 &&
                        post.mediaUrls.length === 1 && (
                          <div className='post-image w-[100%] mt-2 flex justify-center items-center'>
                            {post.mediaUrls[0].fileType.startsWith("video/") ? (
                              <video
                                src={post.mediaUrls[0].url || ""}
                                alt='this is post video'
                                className='w-[95%] max-h-[800px] rounded-md h-auto'
                                controls // You can add controls for the video
                                muted // Optional: Start video muted to prevent unwanted audio
                                preload='metadata' // Load only metadata at first
                                ref={videoRef}
                              />
                            ) : (
                              <img
                                src={post.mediaUrls[0].url || ""}
                                alt='this is post image'
                                className='w-[95%] max-h-[800px] rounded-md h-auto'
                              />
                            )}
                          </div>
                        )}

                      {post.mediaUrls &&
                        post.mediaUrls.length > 0 &&
                        post.mediaUrls.length === 2 && (
                          <div className='post-image w-[100%] mt-2 flex gap-1 justify-center items-center'>
                            {post.mediaUrls.map((mediaUrl, index) =>
                              mediaUrl.fileType.startsWith("video/") ? (
                                <video
                                  key={index}
                                  src={mediaUrl.url || ""}
                                  ref={videoRef}
                                  alt='this is post video'
                                  className='w-[50%] max-h-[300px] min-h-[300px]  rounded-md h-auto border border-gray-400 border-opacity-30'
                                  controls // You can add controls for the video
                                  muted // Optional: Start video muted to prevent unwanted audio
                                  preload='metadata' // Load only metadata at first
                                />
                              ) : (
                                <img
                                  key={index}
                                  src={mediaUrl.url || ""}
                                  alt='this is post image'
                                  className='w-[50%] max-h-[300px]  min-h-[300px] rounded-md h-auto border border-gray-400 border-opacity-30'
                                />
                              )
                            )}
                          </div>
                        )}

                      {post.mediaUrls &&
                        post.mediaUrls.length > 0 &&
                        post.mediaUrls.length === 3 && (
                          <div className='post-image w-full mt-2 flex space-x-1'>
                            <div className=' flex flex-col  space-y-1  rounded-md min-w-[300px]'>
                              {post.mediaUrls
                                .slice(0, 2)
                                .map((mediaUrl, index) =>
                                  mediaUrl.fileType.startsWith("video/") ? (
                                    <video
                                      key={index}
                                      src={mediaUrl.url || ""}
                                      ref={videoRef}
                                      alt='this is post video'
                                      className='w-[300px] h-[250px] max-h-[250px] border border-gray-400 border-opacity-40 min-h-[250px] rounded-md '
                                      width='100%'
                                      controls
                                      muted
                                      preload='metadata'
                                    />
                                  ) : (
                                    <img
                                      key={index}
                                      src={mediaUrl.url || ""}
                                      alt='this is post image'
                                      className='w-[300px] max-h-[250px] border border-gray-400 border-opacity-40 min-h-[250px] rounded-md '
                                    />
                                  )
                                )}
                            </div>
                            <div className='  rounded-md'>
                              {post.mediaUrls
                                .slice(2, 3)
                                .map((mediaUrl, index) =>
                                  mediaUrl.fileType.startsWith("video/") ? (
                                    <video
                                      key={index}
                                      src={mediaUrl.url || ""}
                                      ref={videoRef}
                                      alt='this is post video'
                                      className='w-[400px] min-h-[505px] h-[250px] rounded-md border border-gray-400 border-opacity-40'
                                      width='100%'
                                      controls
                                      muted
                                      preload='metadata'
                                    />
                                  ) : (
                                    <img
                                      key={index}
                                      src={mediaUrl.url || ""}
                                      alt='this is post image'
                                      className='min-w-[250px] min-h-[505px] rounded-md border border-gray-400 border-opacity-40 '
                                    />
                                  )
                                )}
                            </div>
                          </div>
                        )}

                      {post.mediaUrls &&
                        post.mediaUrls.length > 0 &&
                        post.mediaUrls.length >= 5 && (
                          <>
                            {showAllMedia[post._id] ? (
                              <Box
                                sx={{
                                  width: "100%",
                                  padding: "10px",
                                  height: "500px",
                                }}
                              >
                                <Slider {...settings}>
                                  {post.mediaUrls.map((mediaUrl, index) => (
                                    <Card
                                      className='border-2 rounded-md border-gray-400 border-opacity-40 shadow-md'
                                      key={index}
                                      style={{ width: "100%" }}
                                    >
                                      {mediaUrl.fileType.startsWith(
                                        "image/"
                                      ) ? (
                                        <CardMedia
                                          component='img'
                                          alt={`Media ${index + 1}`}
                                          image={mediaUrl.url}
                                          sx={{
                                            height: "480px",
                                            width: "100%",
                                            objectFit: "cover",
                                          }}
                                        />
                                      ) : (
                                        <video
                                          width='100%'
                                          ref={videoRef}
                                          src={mediaUrl.url || ""}
                                          className='h-[480px]'
                                          controls
                                          preload='metadata'
                                          style={{ objectFit: "cover" }}
                                        />
                                      )}
                                    </Card>
                                  ))}
                                </Slider>
                              </Box>
                            ) : (
                              <div className='post-image w-[100%] relative mt-2 flex flex-wrap gap-1 justify-center items-center'>
                                {post.mediaUrls
                                  .slice(0, 4)
                                  .map((mediaUrl, index) => {
                                    const isLastMedia = index === 3; // Check if it's the last of the 4 items
                                    const classNameOf = `w-[45%] max-h-[300px] min-h-[300px] rounded-md h-auto border border-gray-400 border-opacity-30 ${
                                      isLastMedia ? "opacity-100 blur-sm" : ""
                                    }`; // Adjust opacity and blur for the last media

                                    return mediaUrl.fileType.startsWith(
                                      "video/"
                                    ) ? (
                                      <video
                                        key={index}
                                        src={mediaUrl.url || ""}
                                        ref={videoRef}
                                        alt='this is post video'
                                        className={classNameOf}
                                        controls
                                        muted
                                        preload='metadata'
                                      />
                                    ) : (
                                      <img
                                        key={index}
                                        src={mediaUrl.url || ""}
                                        alt='this is post image'
                                        className={classNameOf}
                                      />
                                    );
                                  })}
                                <div
                                  onClick={() => {
                                    setShowAllMedia((prev) => ({
                                      ...prev,
                                      [post._id]: true,
                                    }));
                                  }}
                                  className='max-h-[250px] min-w-[250px] right-[50px] top-[330px] opacity-90  absolute min-h-[250px] flex justify-center items-center z-50 cursor-pointer'
                                >
                                  <AddIcon
                                    fontSize='large'
                                    className='text-[#fff]'
                                  />
                                  <p className='text-white text-2xl font-semibold'>
                                    {post.mediaUrls.length - 4} More
                                  </p>
                                </div>
                              </div>
                            )}
                          </>
                        )}

                      {post.mediaUrls &&
                        post.mediaUrls.length > 0 &&
                        post.mediaUrls.length === 4 && (
                          <div className='post-image w-[100%] mt-2 flex flex-wrap gap-1 justify-center items-center'>
                            {post.mediaUrls.map((mediaUrl, index) =>
                              mediaUrl.fileType.startsWith("video/") ? (
                                <video
                                  key={index}
                                  src={mediaUrl.url || ""}
                                  ref={videoRef}
                                  alt='this is post video'
                                  className='w-[45%] max-h-[300px] min-h-[300px]  rounded-md h-auto border border-gray-400 border-opacity-30'
                                  controls // You can add controls for the video
                                  muted // Optional: Start video muted to prevent unwanted audio
                                  preload='metadata' // Load only metadata at first
                                />
                              ) : (
                                <img
                                  key={index}
                                  src={mediaUrl.url || ""}
                                  alt='this is post image'
                                  className='w-[45%] max-h-[300px]  min-h-[300px] rounded-md h-auto border border-gray-400 border-opacity-30'
                                />
                              )
                            )}
                          </div>
                        )}

                      <div className='flex justify-between'>
                        <p className={"text-[#959799]"}>
                          {post.likeCount} likes
                        </p>
                        <p className={"text-[#959799]"}>
                          {commentCount[post._id]
                            ? commentCount[post._id]
                            : "0"}{" "}
                          comments
                        </p>
                      </div>
                      <div className='divider'></div>

                      <div className='like-comment'>
                        <ChangeAs
                          actAs={actAs}
                          setActAs={setActAs}
                          setChangeAsDialog={setChangeAsDialog}
                          currUserData={currUserData}
                          changeAsDialog={changeAsDialog}
                        />
                        <div className='like-comment-wrapper flex w-[50%]  items-center space-x-5 p-'>
                          {currUserData &&
                            currUserData.company &&
                            currUserData.company.length > 0 && (
                              <div
                                onClick={() => {
                                  setChangeAsDialog(true);
                                }}
                                className='flex  min-w-[80px] cursor-pointer items-center space-x-2'
                              >
                                <img
                                  src={
                                    (actAs.type === "company" &&
                                      currUserData.company.find(
                                        (company) => company._id === actAs.id
                                      ).profilePicture) ||
                                    (actAs.type === "user" &&
                                      currUserData.profilePicture &&
                                      currUserData.profilePicture) ||
                                    "/blank.png"
                                  }
                                  alt='company logo'
                                  className='rounded-full border border-gray-400 border-opacity-40 min-w-[55px] max-w-[55px] min-h-[55px] max-h-[55px]'
                                />
                                <KeyboardArrowDownIcon className='text-[#959799]' />
                              </div>
                            )}

                          <div
                            className={`like flex mr-4 space-x-1 cursor-pointer ${
                              lightMode && "hover:bg-[#F4F2EE] "
                            }  hover:bg-[#293138] p-2 rounded-md`}
                            onClick={() => {
                              handleLike(
                                post._id,
                                post.createdBy?.id,
                                post.createdBy?.type
                              );
                            }}
                          >
                            {likes &&
                            actAs &&
                            likes[post._id] &&
                            likes[post._id][actAs.id] ? (
                              <FavoriteIcon className='text-red-500' />
                            ) : (
                              <FavoriteBorderIcon className='' />
                            )}

                            <button className='like'>Like</button>
                          </div>
                          <div
                            className={`comment flex space-x-1 ${
                              lightMode && "hover:bg-[#F4F2EE] "
                            }  cursor-pointer hover:bg-[#293138] p-2 rounded-md`}
                            onClick={() => {
                              handleCommentClick(post._id);
                              getAllCommentsFunc(post._id);
                            }}
                          >
                            <InsertCommentIcon />
                            <button className='comment'>Comment</button>
                          </div>
                        </div>
                      </div>

                      {commentBoxOpen[post._id] && (
                        <div key={post._id}>
                          <div
                            className={`comment transition-all duration-500 ease-in-out ${
                              commentBoxOpen[post._id] ? "active" : ""
                            }`}
                          >
                            <div className='flex items-center space-x-2'>
                              <img
                                src={
                                  actAs.type === "user"
                                    ? currUserData?.profilePicture &&
                                      currUserData?.profilePicture
                                    : currUserData.company.find(
                                        (com) => com._id === actAs.id
                                      ).profilePicture || "/blank.png"
                                }
                                className='rounded-full w-[7%] h-[40px] border border-gray-400 border-opacity-40'
                                alt='your profile picture'
                              />
                              <div className='w-[100%]'>
                                <input
                                  type='text'
                                  name='comment'
                                  value={commentText} // Important for clearing the commentText
                                  ref={commentInputRef}
                                  placeholder='Give Your Comment'
                                  id='comment'
                                  className={`rounded-md p-2 bg-[#F4F2EE] border border-gray-400 border-opacity-40 w-[100%]`}
                                  onChange={(e) => {
                                    setCommentText(e.target.value);
                                    enableDisableCommentPostBtn();
                                  }}
                                />
                              </div>
                            </div>
                            <div className='flex justify-end mt-2'>
                              <button
                                className={`text-sm ${
                                  isDisabledPostBtn
                                    ? "bg-[#b5b5b5] text-black"
                                    : "bg-[#71B7FB] text-black"
                                } p-2 rounded-md`}
                                onClick={() => {
                                  handleCommentPost(
                                    post._id,
                                    post.createdBy?.id,
                                    post.createdBy?.type
                                  );
                                }}
                                disabled={isDisabledPostBtn}
                              >
                                Post
                              </button>
                            </div>
                          </div>
                          {commentsByPost[post._id] && (
                            <p className='mb-3 font-semibold'>All Comments</p>
                          )}
                          <div className='space-y-2'>
                            {commentsByPost[post._id] ? (
                              commentsByPost[post._id].map((comment) => {
                                return (
                                  <div
                                    key={comment._id}
                                    className='show-comments w-[100%]'
                                  >
                                    <div className='flex space-x-2'>
                                      <img
                                        src={
                                          comment.createdBy &&
                                          comment.createdBy.id.profilePicture
                                        }
                                        alt='who commented'
                                        className='rounded-full border border-gray-400 border-opacity-40 w-[7%] h-[40px]'
                                      />
                                      <div className='commet-des heading-post p-2 w-[100%] pl-3 rounded-md bg-[#F4F2EE] border border-gray-400 border-opacity-40 flex-row space-y-[-5px]'>
                                        <p className='hover:underline hover:text-blue-500 cursor-pointer'>
                                          {comment.createdBy &&
                                            comment.createdBy.id.name}
                                        </p>
                                        <p className='text-[#959799] text-sm'>
                                          {comment.createdBy &&
                                            comment.createdBy.id.city &&
                                            comment.createdBy.id.city.toLowerCase()}
                                        </p>
                                        <p className='text-[#959799] text-sm'>
                                          {comment.createdAt &&
                                            moment(comment.createdAt).fromNow()}
                                        </p>
                                        <div className='comment-text'>
                                          <p
                                            dangerouslySetInnerHTML={{
                                              __html: linkifyContent(
                                                comment.text
                                              ),
                                            }}
                                            className='mt-2'
                                          ></p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div>No comments Available</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            : !postSkeleton && (
                <div className='text-white font-bold'>
                  No posts, pleasse relogin
                </div>
              )}
        </div>
      </div>
    </div>
  );
};

export default PostView;
