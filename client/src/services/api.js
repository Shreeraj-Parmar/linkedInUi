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
export const getAllPostFromDB = async (data) => {
  try {
    let res = await axios.post(`${API}/post/all`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling getAllPostFromDB & error is : ${error.message}`
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
export const getUserDataAccSameCity = async () => {
  try {
    // Append postId to the URL as a query parameter
    let res = await axios.get(`${API}/user/same-city`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    console.log(
      `error while calling getUserDataAccSameCity & error is : ${error.message}`
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
export const getMyFollowers = async (what) => {
  try {
    let res = await axios.get(`${API}/follow?what=${what}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
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
