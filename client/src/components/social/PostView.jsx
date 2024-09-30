import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useContext,
  useRef,
} from "react";
import { AllContext } from "../../context/UserContext.jsx";

// icons
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
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
} from "../../services/api.js";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const PostView = ({ imgUrl, setLoginDialog, loginDialog, isLogin }) => {
  const { setCurrUserData, currUserData, setCurrMenu } = useContext(AllContext);
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
  const navigate = useNavigate();

  console.log("in postview islogin is: ", isLogin);

  const getCommentCountFunction = async () => {
    let res = await getCommentCount();
    console.log(res.data.allCommentCount);
    setCommentCount(res.data.allCommentCount);
  };

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
      // Toggle the follow status locally
      setFollowStatus((prevStatus) => ({
        ...prevStatus,
        [receiver]: !prevStatus[receiver],
      }));
    } else {
      console.error("Error while following/unfollowing:", res.data.message);
    }
  };

  //
  const handleCommentInputChange = (e) => {
    setCommentText(e.target.value);
  };

  const enableDisableCommentPostBtn = () => {
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

  const postFunc = async () => {
    let res = await getAllPostFromDB();
    let sortedPosts = res.data.allPosts.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt); // Sort posts by newest first
    });
    console.log("sotred post is here", sortedPosts);

    // let finalArr = sortedPosts.filter(
    //   (post) => post.user._id !== currUserData._id

    setAllPost(sortedPosts);

    console.log("res.data.allPosts:", res.data.allPosts); // Check if posts are being fetched
    if (!Array.isArray(res.data.allPosts)) {
      console.error("Error: allPosts is not an array", res.data.allPosts);
    }

    if (currUserData) {
      const initialLikes = {};
      res.data.allPosts.forEach((post) => {
        // Check if the current user has liked the post
        initialLikes[post._id] = post.likedBy.includes(currUserData._id);
      });
      setLikes(initialLikes);
      console.log("Likes initialized:", initialLikes);
    } else {
      // User is not logged in, set an empty object for likes
      setLikes({});
    }
    checkFollowStatus();
  };
  useLayoutEffect(() => {
    getData();
  }, [isLogin]);
  useEffect(() => {
    postFunc(); // Fetch posts once user data is available
    getCommentCountFunction();
  }, [currUserData, !postDialog]);

  // get user data
  const getData = async () => {
    let res = await getUserData();
    console.log("calling func to get currUserData is", res.data);
    setCurrUserData(res.data.user);
  };

  // for like update

  const handleLike = async (postId) => {
    if (!isLogin) {
      setLoginDialog(true); // Show login dialog if user is not logged in
      return;
    }
    // getData();
    const currentLikeStatus = likes[postId];

    // Optimistically update UI before waiting for response
    setLikes((prev) => ({
      ...prev,
      [postId]: !currentLikeStatus, // Toggle like status
    }));

    //     post._id === postId
    //       ? {
    //           ...post,
    //           likedBy: !currentLikeStatus
    //             ? [...post.likedBy, currUserData._id]
    //             : post.likedBy.filter((id) => id !== currUserData._id),
    //         }
    //       : post
    //   );
    // });
    console.log("curr id is", currUserData);
    let res = await toggleLikeOnPost({
      postId: postId,
      likeStatus: !currentLikeStatus,
      whoLiked: currUserData._id,
    });
    if (res.status === 200) {
      console.log(res.data.message);
      postFunc(postId); // Call postFunc after successful like update
    } else {
      console.error("Error updating like status on server", res.data.message);
    }
  };
  // get all comment
  const getAllCommentsFunc = async (id) => {
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
  };

  // send CommentData to the Backend
  const handleCommentPost = async (id) => {
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
      getAllCommentsFunc(id);
    } else {
      console.log("error somthing :", res.data.message);
    }
  };

  return (
    <div className="post-wrapper  w-[100%]  h-[100%] flex-row space-y-3">
      <PostDialog postDialog={postDialog} setPostDialog={setPostDialog} />
      <div className="write-post text-[#DBDBDC] bg-[#1B1F23] w-[100%] h-[10vh] rounded-md p-2    ">
        <div className="write-post-wrapper  flex justify-center items-center ">
          <div className="write-post-left w-[10%]">
            <img
              src={imgUrl || "/blank.png"}
              alt="your profile picture"
              className="rounded-full  w-[80%] h-[55px]"
            />
          </div>
          <div
            className="write-post-right w-[90%] p-5 h-[50px] border border-[#DBDBDC] rounded-full flex justify-start items-center hover:bg-[#DBDBDC] hover:bg-opacity-10 cursor-pointer"
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

      <div className="posts text-[#DBDBDC] bg-[#000000] h-fit  w-[100%]   p-1 rounded-md">
        <div className=" h-[100%]  p-2  flex-row space-y-3  ">
          {/* map post logic here */}

          {allPost && allPost.length > 0 ? (
            allPost.map((post) => {
              return (
                <div className="flex justify-center" key={post._id}>
                  <div className="post bg-[#1B1F23]   p-5  rounded-md w-[100%] h-fit space-y-2">
                    <div className="post-des flex    w-[100%] space-x-2">
                      <img
                        src={post.user.profilePicture || "/blank.png"}
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
                          className="hover:underline  hover:text-blue-500 cursor-pointer"
                        >
                          {currUserData && post.user._id === currUserData._id
                            ? "You"
                            : post.user.name}
                        </p>
                        <p className=" text-[#959799] text-sm   ">
                          {post.user.city.toLowerCase()}
                        </p>
                        <p className="text-[#959799] text-sm    ">
                          {moment(post.createdAt).fromNow()}
                        </p>
                      </div>
                      {currUserData && post.user._id !== currUserData._id ? (
                        <div className="follow-btn p-2 relative lg:left-52">
                          <button
                            onClick={() => {
                              handleFollowClick(post.user._id);
                            }}
                            className="p-2  rounded-md text-[#AAD6FF] hover:bg-[#1F2F41]"
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
                              className="p-2  rounded-md text-[#AAD6FF] hover:bg-[#1F2F41]"
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
                          className=" w-[95%] rounded-md h-auto"
                        />
                      </div>
                    )}

                    <div className="flex justify-between">
                      <p className="text-[#959799]">{post.likeCount} likes</p>
                      <p className="text-[#959799]">
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
                          className="like flex space-x-1 cursor-pointer hover:bg-[#293138] p-2 rounded-md"
                          onClick={() => {
                            handleLike(post._id);
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
                          className="comment flex space-x-1 cursor-pointer hover:bg-[#293138] p-2 rounded-md"
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
                              className="rounded-full  w-[7%] h-[40px]"
                              alt="your profile picture"
                            />
                            <div className="w-[100%]">
                              <input
                                type="text"
                                name="comment"
                                ref={commentInputRef}
                                placeholder="Give Your Comment"
                                id="comment"
                                className="rounded-md p-2 bg-[#1B1F23] border border-[#fff] w-[100%]"
                                onChange={(e) => {
                                  handleCommentInputChange(e);
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
                                handleCommentPost(post._id);
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
                                        src={comment.user.profilePicture}
                                        alt="who commented"
                                        className="rounded-full  w-[7%] h-[40px]"
                                      />
                                      <div className="commet-des heading-post p-2 w-[100%] pl-3 rounded-md bg-[#293138] flex-row space-y-[-5px]">
                                        <p className="hover:underline hover:text-blue-500 cursor-pointer">
                                          {comment.user.name}
                                        </p>
                                        <p className=" text-[#959799] text-sm   ">
                                          {comment.user.city.toLowerCase()}
                                        </p>
                                        <p className="text-[#959799] text-sm    ">
                                          {moment(comment.createdAt).fromNow()}
                                        </p>
                                        <div className="comment-text">
                                          <p className="mt-2">{comment.text}</p>
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
          ) : (
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
