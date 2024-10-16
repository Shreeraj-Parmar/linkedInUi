import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// signup
export const sendSignUpData = async (data) => {
  try {
    let res = await axios.post(`${API}/user/signup`, data);
    return res;
  } catch (error) {
    console.log(
      `error while calling sendSignUpData & error is : ${error.message}`
    );
  }
};

// Login

export const sendLoginData = async (data) => {
  try {
    let res = await axios.post(`${API}/user/login`, data);
    return res;
  } catch (error) {
    console.log(
      `error while calling sendLoginData & error is : ${error.message}`
    );
  }
};

// get all users data

export const getAllUserData = async () => {
  try {
    let res = await axios.get(`${API}/users`);
    return res;
  } catch (error) {
    console.log(
      `error while calling getAllUserData & error is : ${error.message}`
    );
  }
};

// get Pre-SignedURL
export const getPresignedURL = async (data) => {
  try {
    let res = await axios.post(`${API}/aws/generate`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling getPresignedURL & error is : ${error.message}`
    );
  }
};

// File-upload in aws-s3
export const uploadFileAWS = async (data) => {
  try {
    let res = await axios.put(`${data.uploadURL}`, data.postFile, {
      headers: {
        "Content-Type": data.fileType,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
    console.log("Full Error Response: ", error.response);
    console.log(
      `error while calling uploadFileAWS & error is : ${error.message}`
    );
  }
};

// save profile url into db
export const saveProfileURL = async (data) => {
  try {
    let res = await axios.post(`${API}/aws/url`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling saveProfileURL & error is : ${error.message}`
    );
  }
};

// check profile url is available or not

export const ckeckURLAvailable = async (data) => {
  try {
    let res = await axios.post(`${API}/user/url-check`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling ckeckURLAvailable & error is : ${error.message}`
    );
  }
};

// get user data
export const getUserData = async () => {
  console.log(localStorage.getItem("token"));
  try {
    let res = await axios.get(`${API}/user`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling getUserData & error is : ${error.message}`
    );
  }
};

// send edu details to add edu field
export const sendEDUDetails = async (data) => {
  try {
    let res = await axios.post(`${API}/user/edu`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling sendEDUDetails & error is : ${error.message}`
    );
  }
};

// generate presigned url for post media

export const getURLForPOST = async (data) => {
  try {
    let res = await axios.post(`${API}/aws/post/generate`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling getURLForPOST & error is : ${error.message}`
    );
  }
};

// send post data to backent to save into db

export const savePostData = async (data) => {
  try {
    let res = await axios.post(`${API}/post`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling savePostData & error is : ${error.message}`
    );
  }
};

// get all post from DB

export const getAllPostFromDB = async (page, limit) => {
  try {
    // Construct the URL with query parameters
    const url = `${API}/post/all?page=${page}&limit=${limit}`;

    // Use GET request with the constructed URL
    let res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `Error while calling getAllPostFromDB & error is: ${error.message}`
    );
  }
};

// update like count
export const toggleLikeOnPost = async (data) => {
  try {
    let res = await axios.post(`${API}/like`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling toggleLikeOnPost & error is : ${error.message}`
    );
  }
};

// send comment data to the backend
export const sendCommentData = async (data) => {
  try {
    let res = await axios.post(`${API}/comment`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling sendCommentData & error is : ${error.message}`
    );
  }
};

// get comment according post
export const getCommentAccPost = async (postId) => {
  try {
    // Append postId to the URL as a query parameter
    let res = await axios.get(`${API}/comment?postId=${postId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling getCommentAccPost & error is : ${error.message}`
    );
  }
};

// get limited user data which have same city
export const getUserDataAccSameCity = async (page, limit) => {
  try {
    // Pass page and limit as query parameters
    let res = await axios.get(
      `${API}/user/same-city?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return res;
  } catch (error) {
    console.log(
      `Error while calling getUserDataAccSameCity & error is: ${error.message}`
    );
  }
};

// get user data according userId         // for admin only

export const getUserDataAccId = async (id) => {
  // console.log("token is", localStorage.getItem("token"));
  try {
    // Append postId to the URL as a query parameter
    let res = await axios.get(`${API}/user/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling getUserDataAccId & error is : ${error.message}`
    );
  }
};

// check if it is admin or not
export const checkAdmin = async () => {
  // console.log("token is", localStorage.getItem("token"));
  try {
    // Append postId to the URL as a query parameter
    let res = await axios.get(`${API}/admin/verify`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(`error while calling checkAdmin & error is : ${error.message}`);
  }
};

// verify AccessToken

export const verifyToken = async () => {
  // console.log("token is", localStorage.getItem("token"));
  try {
    // Append postId to the URL as a query parameter
    let res = await axios.get(`${API}/token/verify`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling verifyToken & error is : ${error.message}`
    );
  }
};

// if in login page & have token than redirect acc.. admin or user

export const checkRoutes = async () => {
  try {
    // Append postId to the URL as a query parameter
    let res = await axios.get(`${API}/token/route`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling checkRoutes & error is : ${error.message}`
    );
  }
};

// get count of users & posts
export const getUserPostCount = async () => {
  try {
    // Append postId to the URL as a query parameter
    let res = await axios.get(`${API}/admin/count`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling getUserPostCount & error is : ${error.message}`
    );
  }
};

// get count of all comments
export const getCommentCount = async () => {
  try {
    // Append postId to the URL as a query parameter
    let res = await axios.get(`${API}/comment/count`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling getCommentCount & error is : ${error.message}`
    );
  }
};

// follow req

export const sendFollowReq = async (data) => {
  try {
    let res = await axios.post(`${API}/follow`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling sendFollowReq & error is : ${error.message}`
    );
  }
};

// check follow or not !

export const checkIfFollowingUser = async (userId) => {
  try {
    let res = await axios.get(`${API}/follow/check/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling checkIfFollowingUser & error is : ${error.message}`
    );
  }
};

// get user followers list
export const getMyFollowers = async (what, page) => {
  try {
    let res = await axios.get(
      `${API}/follow?what=${what}&page=${page}&limit=7`,
      {
        // Pass page and limit
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return res;
  } catch (error) {
    console.log(
      `error while calling getMyFollowers & error is : ${error.message}`
    );
  }
};

// get count of connections

export const getCountOfConnections = async () => {
  try {
    let res = await axios.get(`${API}/connection/count`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling getCountOfConnections & error is : ${error.message}`
    );
  }
};

// get all connection req

export const getAllConnectionReq = async () => {
  try {
    let res = await axios.get(`${API}/connection`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling getAllConnectionReq & error is : ${error.message}`
    );
  }
};

// update connection req

export const updateConnectionReq = async (data) => {
  try {
    let res = await axios.put(`${API}/connection`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling updateConnectionReq & error is : ${error.message}`
    );
  }
};

// send coonection req
export const sendConnect = async (data) => {
  try {
    let res = await axios.post(`${API}/connection/req`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling sendConnect & error is : ${error.message}`
    );
  }
};

// set conversation
export const setConversation = async (data) => {
  try {
    let res = await axios.post(`${API}/conversation`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling setConversation & error is : ${error.message}`
    );
  }
};

// get recever Data in coversation

export const getReceiverData = async (data) => {
  try {
    let res = await axios.post(`${API}/conversation/receiver`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling getReceiverData & error is : ${error.message}`
    );
  }
};

// get aall conversations

export const getAllConversations = async () => {
  try {
    let res = await axios.get(`${API}/conversation`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling getAllConversations & error is : ${error.message}`
    );
  }
};

// send msg

export const sendMsg = async (data) => {
  try {
    let res = await axios.post(`${API}/msg`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(`error while calling sendMsg & error is : ${error.message}`);
  }
};

// get all msg from conversations
export const getMsgAccConvId = async (id, page = 1, limit = 20) => {
  try {
    // Send page and limit as query parameters to the API
    let res = await axios.get(`${API}/msg/${id}?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `Error while calling getMsgAccConvId & error is: ${error.message}`
    );
  }
};

// mark as read message sysytem
export const markAsRead = async (data) => {
  try {
    let res = await axios.post(`${API}/msg/read`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(`error while calling markAsRead & error is : ${error.message}`);
  }
};

// get all unread msg for

export const getAllUnreadMsg = async () => {
  console.log("trrrrrrrrrigrerererer");
  console.log("token isssssssssssssssssss", localStorage.getItem("token"));
  try {
    let res = await axios.get(`${API}/msg-unread`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling getAllUnreadMsg & error is : ${error.message}`
    );
  }
};

// check each other connected or not , if connecct than we redirect to message otherwise not..
export const checkConnectionEachOther = async (data) => {
  try {
    let res = await axios.post(`${API}/msg/verify`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling checkConnectionEachOther & error is : ${error.message}`
    );
  }
};

// new notification
export const sendNotification = async (data) => {
  console.log("new notification client function trigger");
  try {
    let res = await axios.post(`${API}/notification`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling sendNotification & error is : ${error.message}`
    );
  }
};

// get count of notifications that user unread
// new notification
export const getAllUnreadNotiCount = async () => {
  try {
    let res = await axios.get(`${API}/notification/count`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling getAllUnreadNotiCount & error is : ${error.message}`
    );
  }
};

// get all notification details

export const fatchAllNotifications = async (page, limit) => {
  try {
    let res = await axios.get(`${API}/notifications`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params: { limit, page }, // Use `page` instead of `skip`
    });
    return res;
  } catch (error) {
    console.log(`Error while calling fatchAllNotifications: ${error.message}`);
    return null; // Return null or handle the error as needed
  }
};

// update isClick on notification

export const updateNotiClick = async (data) => {
  try {
    let res = await axios.put(`${API}/notification`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(`Error while calling updateNotiClick: ${error.message}`);
    return null; // Return null or handle the error as needed
  }
};

// get all connectionReq count of user
export const getConnectionReqCount = async () => {
  try {
    let res = await axios.get(`${API}/connection-req/count`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(`Error while calling getConnectionReqCount: ${error.message}`);
    return null; // Return null or handle the error as needed
  }
};

// mark as read connection req

export const markAsReadConn = async () => {
  console.log("mark as read connection req");
  try {
    let res = await axios.get(`${API}/connection-req`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(`Error while calling markAsReadConn: ${error.message}`);
    return null; // Return null or handle the error as needed
  }
};

// refresh token
export const refresIt = async (dat) => {
  try {
    let response = await axios.post(`${API}/refresh-verify`, dat);
    return response;
  } catch (error) {
    console.error(
      "error while calling refresIt forntend api & message is : ",
      error.message
    );
  }
};

// feach to more connect with users
export const fatchAllUsersWhichNotConnected = async (page, limit) => {
  try {
    let res = await axios.get(`${API}/users/more`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params: { limit, page }, // Use `page` instead of `skip`
    });
    return res;
  } catch (error) {
    console.log(
      `Error while calling fatchAllUsersWhichNotConnected: ${error.message}`
    );
    return null; // Return null or handle the error as needed
  }
};

// withdraw request
export const withdrawConnectionReq = async (data) => {
  try {
    let res = await axios.put(`${API}/connection/withdraw`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(`Error while calling withdrawConnectionReq: ${error.message}`);
    return null; // Return null or handle the error as needed
  }
};
