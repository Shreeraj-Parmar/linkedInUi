import express from "express";
const router = express.Router();
import jwtMiddle from "../middlewares/jwt-middleware.js";
import {
  saveNewUser,
  checkLogin,
  sendAllData,
  checkURL,
  sendUserData,
  saveEDUDetails,
  sendDataAccCity,
  saveFollow,
  checkFollowOrNot,
  sendFollowerOrFollowingList,
  sendConnectionCount,
  sendAllConnectionReq,
  updateConnectionInDB,
  sendConnectReq,
} from "../controller/user-controller.js";
import {
  sendPreSignedURL,
  saveURLIntoDB,
  sendPreSignedURLFORPOST,
} from "../controller/file-controller.js";
import {
  savePostDataIntoDB,
  sendAllPosts,
  updateLike,
  sendCommentAccPost,
  saveCommentIntoDB,
  sendCommentCount,
} from "../controller/post-controller.js";
import {
  sendUserDataAccId,
  checkAdminOrNot,
  sendTokenValidation,
  sendRoutsAccToken,
  sendCount,
} from "../controller/admin-controller.js";

import {
  newConversation,
  sendReceiverData,
  sendAllConversations,
} from "../controller/conversation-controller.js";

import {
  saveMSGInDB,
  sendALlMsgAccConvId,
} from "../controller/msg-controller.js";

router.post("/user/signup", saveNewUser);
router.post("/user/url-check", jwtMiddle, checkURL);
router.post("/user/login", checkLogin);
router.get("/user", jwtMiddle, sendUserData);
router.get("/users", sendAllData);
router.post("/user/edu", jwtMiddle, saveEDUDetails);
router.post("/aws/generate", jwtMiddle, sendPreSignedURL);
router.post("/aws/post/generate", jwtMiddle, sendPreSignedURLFORPOST);
router.post("/aws/url", jwtMiddle, saveURLIntoDB);
router.post("/post", jwtMiddle, savePostDataIntoDB);
router.post("/post/all", sendAllPosts);
router.post("/like", jwtMiddle, updateLike);
router.post("/comment", jwtMiddle, saveCommentIntoDB);
router.get("/comment", sendCommentAccPost);
router.get("/comment/count", sendCommentCount);
router.get("/user/same-city", jwtMiddle, sendDataAccCity);

// for admin
router.get("/user/:id", sendUserDataAccId); // access all users
router.get("/admin/verify", jwtMiddle, checkAdminOrNot);
router.get("/admin/count", jwtMiddle, sendCount);

// verify token & user
router.get("/token/verify", jwtMiddle, sendTokenValidation);
router.get("/token/route", jwtMiddle, sendRoutsAccToken);

// followers & following && connections
router.post("/follow", jwtMiddle, saveFollow);
router.get("/follow", jwtMiddle, sendFollowerOrFollowingList);
router.get("/follow/check/:userId", jwtMiddle, checkFollowOrNot);
router.get("/connection/count", jwtMiddle, sendConnectionCount);
router.get("/connection", jwtMiddle, sendAllConnectionReq);
router.post("/connection/req", jwtMiddle, sendConnectReq);

router.put("/connection", jwtMiddle, updateConnectionInDB);

// conversation routs

router.post("/conversation", jwtMiddle, newConversation);
router.get("/conversation", jwtMiddle, sendAllConversations);
router.post("/conversation/receiver", jwtMiddle, sendReceiverData);

// msg
router.post("/msg", jwtMiddle, saveMSGInDB);
router.get("/msg/:convId", jwtMiddle, sendALlMsgAccConvId);

export default router;
