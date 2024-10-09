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
import { toast } from "react-toastify";

import FavoriteIcon from "@mui/icons-material/Favorite";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import PostDialog from "../../Post Compo/PostDialog";
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
import Tostify from "../Tostify.jsx";

const PostView = ({ imgUrl, setLoginDialog, loginDialog, isLogin }) => {
  const { setCurrUserData, currUserData, setCurrMenu, lightMode } =
    useContext(AllContext);
  const [commentBoxOpen, setCommentBoxOpen] = useState({});
  const [postDialog, setPostDialog] = useState(false);
  const [allPost, setAllPost] = useState([]);
  const [likes, setLikes] = useState({});
  const [isDisabledPostBtn, setIsDisabledPostBtn] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [commentsByPost, setCommentsByPost] = useState({});
  const commentInputRef = useRef();
  const [commentCount, setCommentCount] = useState([]);
  const [followStatus, setFollowStatus] = useState({});
  const [postSkeleton, setPostSkeleton] = useState(true);
  const navigate = useNavigate();
  const [page, setPage] = useState(1); // For pagination
  const [hasMore, setHasMore] = useState(true); // For checking if there are more notifications to load
  const limit = 3; // Number of notifications to load at a time

  // loading state:
  const [loadingPost, setLoadingPost] = useState(true); // Loading state for posts
  const [loadingComments, setLoadingComments] = useState({}); // Loading state for

  const getCommentCountFunction = async () => {
    let res = await getCommentCount();
    console.log(res.data.allCommentCount);
    setCommentCount(res.data.allCommentCount);
  };

  useEffect(() => {
    setTimeout(() => {
      setPostSkeleton(false);
    }, 2000);
  }, []);

  const checkFollowStatus = async () => {
    const status = {};
    for (const post of allPost) {
      let res = await checkIfFollowingUser(post.user._id);
      status[post.user._id] = res.data.isFollowing;
    }
    console.log("follow status", status);
    setFollowStatus(status);
  };

  const handleFollowClick = async (receiver) => {
    if (!isLogin) {
      setLoginDialog(true); // Show login dialog if user is not logged in
      return;
    }
    let res = await sendFollowReq({ receiverId: receiver });
    if (res.status === 200) {
      console.log(res.data.message);
      if (res.data.message === "Now you are following the user!") {
        await sendNotification({
          recipient: receiver,
          sender: currUserData._id,
          type: "follow",
          message: "you have new follower",
        });
      }
      // Toggle the follow status locally
      setFollowStatus((prevStatus) => ({
        ...prevStatus,
        [receiver]: !prevStatus[receiver],
      }));
    } else {
      toast.error(`Some Error Wile follow/unfollow Please Try again !`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
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

      // Check if there are more posts to load
      if (res.data.allPosts.length < limit) {
        setHasMore(false); // No more posts to load
      }

      if (currUserData) {
        const newLikes = {}; // Store the likes for the newly loaded posts
        res.data.allPosts.forEach((post) => {
          // Check if the current user has liked the post
          newLikes[post._id] = post.likedBy.includes(currUserData._id);
        });

        // Use functional setLikes to merge with the existing likes state
        setLikes((prevLikes) => ({
          ...prevLikes, // Spread the previous likes to keep them
          ...newLikes, // Add the new likes from the newly fetched posts
        }));
        console.log("Likes initialized:", newLikes);
      } else {
        setLikes({}); // User is not logged in
      }

      checkFollowStatus(); // Check follow status
    } else {
      console.error("Failed to fetch posts:", res); // Handle error
    }

    setLoadingPost(false); // Stop loading
  };

  useLayoutEffect(() => {
    getData();
  }, [isLogin]);

  // useEffect(() => {
  //   postFunc(page, limit); // Fetch posts once user data is available
  //   getCommentCountFunction();
  // }, [currUserData, !postDialog]);

  useEffect(() => {
    if (hasMore) {
      postFunc(page, limit);
      getCommentCountFunction();
    }
  }, [page]); // Add page as a dependency

  // get user data
  const getData = async () => {
    let res = await getUserData();
    console.log("calling func to get currUserData is", res.data);
    setCurrUserData(res.data.user);
  };

  // for like update

  const handleLike = async (postId, userId, likeArr) => {
    if (!isLogin) {
      setLoginDialog(true); // Show login dialog if user is not logged in
      return;
    }
    // getData();
    const currentLikeStatus = likeArr.includes(currUserData._id);

    console.log("currunt like status", currentLikeStatus);

    // Optimistically update UI before waiting for response
    setLikes((prev) => ({
      ...prev,
      [postId]: !currentLikeStatus, // Toggle like status
    }));

    console.log("curr id is", currUserData);
    let res = await toggleLikeOnPost({
      postId: postId,
      likeStatus: !currentLikeStatus,
      whoLiked: currUserData._id,
    });
    if (res.status === 200) {
      console.log(res.data.message);
      if (res.data.message === "Like status updated") {
        await sendNotification({
          recipient: userId,
          sender: currUserData._id,
          type: "like",
          message: "You Have new Liked On your post",
        });
      }
      postFunc(page, limit); // Call postFunc after successful like update
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
        console.log(newComments); // Log the new comments state
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
  const handleCommentPost = async (id, userId) => {
    if (!isLogin) {
      setLoginDialog(true); // Show login dialog if user is not logged in
      return;
    }
    getData();
    let res = await sendCommentData({
      postId: id,
      whoCommented: currUserData._id,
      text: commentText,
    });
    if (res.status === 200) {
      console.log(res.data.message);
      setCommentText("");

      if (res.data.message === "Comment Added")
        await sendNotification({
          recipient: userId,
          sender: currUserData._id,
          type: "comment",
          message: "you have new comment on post",
        });
      getAllCommentsFunc(id);
    } else {
      console.log("error somthing :", res.data.message);
      setCommentText("");
    }
    console.log("before comment text : ", commentText);
    setCommentText("");

    console.log("after comment text : ", commentText);
  };

  return (
    <div className="post-wrapper  w-[100%]   flex-row space-y-3">
      <Tostify />
      <PostDialog postDialog={postDialog} setPostDialog={setPostDialog} />
      <div
        className={`write-post text-[#DBDBDC] bg-[#1B1F23] w-[100%] h-[10vh] rounded-md p-2 ${
          lightMode && " bg-white text-black"
        }  ${lightMode && " border-2 border-gray-400 border-opacity-40"}  `}
      >
        <div
          className={`write-post-wrapper  flex justify-center items-center `}
        >
          <div className="write-post-left w-[10%]">
            <img
              src={imgUrl || "/blank.png"}
              alt="your profile picture"
              className="rounded-full  w-[80%] h-[55px]"
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
            <p className="write-post-btn">Start to Write Post</p>
          </div>
        </div>
      </div>
      {/* Show All Posts */}

      <div
        onScroll={handleScrollPost}
        className={`posts text-[#DBDBDC]  overflow-auto max-h-[100vh]  w-[100%]   p-1 rounded-md ${
          lightMode && "  text-black"
        }`}
      >
        <div className=" h-[100%]  p-2  flex-row space-y-3  ">
          {/* Skeleton Of Posts */}
          {/* map post logic here */}

          {postSkeleton && (
            <div className="flex justify-center">
              <div
                className={`post bg-[#1B1F23]   p-5  rounded-md w-[100%] h-fit space-y-2 ${
                  lightMode &&
                  " bg-white border-2 shadow-sm border-gray-400 border-opacity-40"
                }`}
              >
                <div className="post-des flex    w-[100%] space-x-2">
                  <Skeleton
                    variant="circular"
                    width={55}
                    height={55}
                    className="rounded-full"
                  />
                  <div className="heading-post  lg:min-w-[200px] flex-row space-y-[-5px]">
                    <Skeleton
                      variant="text"
                      width={150}
                      height={20}
                      className=" rounded-md"
                    />
                    <Skeleton
                      variant="text"
                      width={100}
                      height={15}
                      className=" rounded-md mt-1"
                    />
                    <Skeleton
                      variant="text"
                      width={150}
                      height={15}
                      className=" rounded-md mt-1"
                    />
                  </div>
                </div>
                <div className="post-text w-[100%]">
                  <div>
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={100}
                      className="rounded-md mt-2"
                    />
                  </div>
                </div>

                <div className="post-image w-[100%] mt-2 flex justify-center items-center">
                  <Skeleton
                    variant="rectangular"
                    width="95%"
                    height={300}
                    className="rounded-md mt-2"
                  />
                </div>

                <div className="flex justify-between">
                  <Skeleton
                    variant="text"
                    width={50}
                    height={15}
                    className=" rounded-md mt-1"
                  />
                  <Skeleton
                    variant="text"
                    width={70}
                    height={15}
                    className=" rounded-md mt-1"
                  />
                </div>
                <div className="divider"></div>

                <div className="like-comment">
                  <div className="like-comment-wrapper flex w-[50%]  items-center space-x-5 p-2">
                    <div
                      className={`like flex space-x-1 cursor-pointer ${
                        lightMode && "hover:bg-[#F4F2EE] "
                      }  hover:bg-[#293138] p-2 rounded-md`}
                    >
                      <Skeleton
                        variant="text"
                        width={50}
                        height={15}
                        className=" rounded-md mt-1"
                      />
                    </div>
                    <div
                      className={`comment flex space-x-1 ${
                        lightMode && "hover:bg-[#F4F2EE] "
                      }  cursor-pointer hover:bg-[#293138] p-2 rounded-md`}
                    >
                      <Skeleton
                        variant="text"
                        width={50}
                        height={15}
                        className=" rounded-md mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {allPost && !postSkeleton && allPost.length > 0
            ? allPost.map((post) => {
                // all posts
                return (
                  <div className="flex justify-center" key={post._id}>
                    <div
                      className={`post bg-[#1B1F23]   p-5  rounded-md w-[100%] h-fit space-y-2 ${
                        lightMode &&
                        " bg-white border-2 shadow-sm border-gray-400 border-opacity-40"
                      }`}
                    >
                      <div className="post-des flex    w-[100%] space-x-2">
                        <img
                          src={
                            (post.user && post.user.profilePicture) ||
                            "/blank.png"
                          }
                          alt="who posted this post"
                          className=" w-[9%] h-[55px] rounded-full"
                        />
                        <div className="heading-post  lg:min-w-[200px] flex-row space-y-[-5px]">
                          <p
                            onClick={() => {
                              setCurrMenu("");
                              setTimeout(() => {
                                navigate(`/user/${post.user._id}`);
                              }, 500);
                            }}
                            className={
                              "hover:underline  hover:text-blue-500 cursor-pointer"
                            }
                          >
                            {post.user && post.user.name}
                          </p>
                          <p className={" text-[#959799] text-sm   "}>
                            {post.user && post.user.city.toLowerCase()}
                          </p>
                          <p className={"text-[#959799] text-sm    "}>
                            {moment(post.user && post.createdAt).fromNow()}
                          </p>
                        </div>
                        {currUserData && post.user._id !== currUserData._id ? (
                          <div className="follow-btn p-2 relative lg:left-52">
                            <button
                              onClick={() => {
                                handleFollowClick(post.user && post.user._id);
                              }}
                              className={`p-2  rounded-md ${
                                lightMode &&
                                " text-[#004182]  font-semibold bg-[#fff] hover:bg-[#EBF4FD]"
                              }`}
                            >
                              {followStatus[post.user._id]
                                ? "Folllowing"
                                : "+ Follow"}
                            </button>
                          </div>
                        ) : (
                          !isLogin && (
                            <div className="follow-btn p-2 relative lg:left-52">
                              <button
                                onClick={() => {
                                  setLoginDialog(true);
                                }}
                                className={`p-2  rounded-md  text-[#AAD6FF] hover:bg-[#1F2F41] ${
                                  lightMode &&
                                  " text-[#004182]  font-semibold bg-[#fff] hover:bg-[#EBF4FD]"
                                }`}
                              >
                                +Follow
                              </button>
                            </div>
                          )
                        )}
                      </div>
                      <div className="post-text w-[100%]">
                        <div>
                          <pre className="w-[90%] text-wrap mt-2">
                            {post.text}
                          </pre>
                        </div>
                      </div>
                      {post.url && (
                        <div className="post-image w-[100%] mt-2 flex justify-center items-center">
                          <img
                            src={post.url || ""}
                            alt="this is post image"
                            className={
                              "w-[95%] max-h-[800px] rounded-md h-auto"
                            }
                          />
                        </div>
                      )}

                      <div className="flex justify-between">
                        <p className={"text-[#959799]"}>
                          {post.likeCount} likes
                        </p>
                        <p className={"text-[#959799]"}>
                          {commentCount.find(
                            (comment) => comment._id === post._id
                          )?.comments.length ?? 0}{" "}
                          comments
                        </p>
                      </div>
                      <div className="divider"></div>

                      <div className="like-comment">
                        <div className="like-comment-wrapper flex w-[50%]  items-center space-x-5 p-2">
                          <div
                            className={`like flex space-x-1 cursor-pointer ${
                              lightMode && "hover:bg-[#F4F2EE] "
                            }  hover:bg-[#293138] p-2 rounded-md`}
                            onClick={() => {
                              handleLike(post._id, post.user._id, post.likedBy);
                            }}
                          >
                            {likes[post._id] ? (
                              <FavoriteIcon className="text-red-500" />
                            ) : (
                              <FavoriteBorderIcon className="" />
                            )}

                            <button className="like">Like</button>
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
                            <button className="comment">Comment</button>
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
                            <div className="flex  items-center space-x-2">
                              <img
                                src={imgUrl || "/blank.png"}
                                className="rounded-full  w-[7%] h-[40px] border border-gray-400 border-opacity-40"
                                alt="your profile picture"
                              />
                              <div className="w-[100%]">
                                <input
                                  type="text"
                                  name="comment"
                                  value={commentText} // imp for clearing the commentText
                                  ref={commentInputRef}
                                  placeholder="Give Your Comment"
                                  id="comment"
                                  className={`rounded-md p-2 bg-[#F4F2EE] border border-gray-400 border-opacity-40 w-[100%]`}
                                  onChange={(e) => {
                                    setCommentText(e.target.value);
                                    enableDisableCommentPostBtn();
                                  }}
                                />
                              </div>
                            </div>
                            <div className="flex justify-end mt-2 ">
                              <button
                                className={` text-sm ${
                                  isDisabledPostBtn
                                    ? "bg-[#b5b5b5] text-black"
                                    : "bg-[#71B7FB] text-black"
                                } p-2 rounded-md`}
                                onClick={() => {
                                  handleCommentPost(post._id, post.user._id);
                                }}
                                disabled={isDisabledPostBtn}
                              >
                                Post
                              </button>
                            </div>
                          </div>
                          {commentsByPost[post._id] && (
                            <p className="mb-3 font-semibold ">All Comments</p>
                          )}
                          <div key={post._id} className="space-y-2">
                            {commentsByPost[post._id] ? (
                              commentsByPost[post._id].map((comment) => {
                                return (
                                  <>
                                    <div
                                      key={comment._id}
                                      className="show-comments w-[100%]"
                                    >
                                      <div className="flex space-x-2">
                                        <img
                                          src={
                                            comment.user &&
                                            comment.user.profilePicture
                                          }
                                          alt="who commented"
                                          className="rounded-full border border-gray-400 border-opacity-40  w-[7%] h-[40px]"
                                        />
                                        <div className="commet-des heading-post p-2 w-[100%] pl-3 rounded-md bg-[#F4F2EE] border border-gray-400 border-opacity-40 flex-row space-y-[-5px]">
                                          <p className="hover:underline hover:text-blue-500 cursor-pointer">
                                            {comment.user && comment.user.name}
                                          </p>
                                          <p className=" text-[#959799] text-sm   ">
                                            {comment.user &&
                                              comment.user.city.toLowerCase()}
                                          </p>
                                          <p className="text-[#959799] text-sm    ">
                                            {comment.user &&
                                              moment(
                                                comment.createdAt
                                              ).fromNow()}
                                          </p>
                                          <div className="comment-text">
                                            <p className="mt-2">
                                              {comment.user && comment.text}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
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
                <div className="text-white font-bold">
                  No posts, pleasse relogin
                </div>
              )}
        </div>
      </div>
    </div>
  );
};

export default PostView;
