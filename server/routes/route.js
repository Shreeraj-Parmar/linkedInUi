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
  UpdateConnectReqRead,
  generateRefresh,
  sendConnectReqCount,
  sendAllUsersWhichNotConnected,
  withdrawReq,
  updateUserFavouriteInDB,
  updateUserProfileInDb,
} from "../controller/user-controller.js";
import {
  sendPreSignedURL,
  saveURLIntoDB,
  sendPreSignedURLFORPOST,
  sendURLForDownload,
} from "../controller/file-controller.js";
import {
  savePostDataIntoDB,
  sendAllPosts,
  updateLike,
  sendCommentAccPost,
  saveCommentIntoDB,
  sendCommentCount,
  updatePostDataInDB,
  sendAllPostsAccUser,
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
  markAsReadUpdate,
  sendAllUnreadMSG,
  availableForSendingMsgOrNot,
  deleteMsgInDB,
} from "../controller/msg-controller.js";

import {
  saveNewNotification,
  sendAllNotifications,
  sendNotiCount,
  updateNotiClickOn,
} from "../controller/notification-controller.js";

import { saveNewCompanyInDB } from "../controller/company-controller.js";

// company routs:

router.post("/company", jwtMiddle, saveNewCompanyInDB);

router.post("/user/signup", saveNewUser);
router.post("/user/url-check", jwtMiddle, checkURL);
router.put("/user/profile", jwtMiddle, updateUserProfileInDb);
router.post("/user/login", checkLogin);
router.get("/user", jwtMiddle, sendUserData);
router.get("/users", sendAllData);
router.get("/users/more", jwtMiddle, sendAllUsersWhichNotConnected);
router.put("/user/favourite", jwtMiddle, updateUserFavouriteInDB);
router.post("/user/edu", jwtMiddle, saveEDUDetails);
router.post("/aws/generate", jwtMiddle, sendPreSignedURL);
router.post("/aws/post/generate", jwtMiddle, sendPreSignedURLFORPOST);
router.post("/aws/url", jwtMiddle, saveURLIntoDB);
router.post("/post", jwtMiddle, savePostDataIntoDB);
router.put("/post", jwtMiddle, updatePostDataInDB);
router.get("/post/all", sendAllPosts);
router.get("/post/user/all", sendAllPostsAccUser);
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
router.get("/connection-req/count", jwtMiddle, sendConnectReqCount);
router.get("/connection-req", jwtMiddle, UpdateConnectReqRead);
router.put("/connection/withdraw", jwtMiddle, withdrawReq);

router.put("/connection", jwtMiddle, updateConnectionInDB);

// conversation routs

router.post("/conversation", jwtMiddle, newConversation);
router.get("/conversation", jwtMiddle, sendAllConversations);
router.post("/conversation/receiver", jwtMiddle, sendReceiverData);

// msg
router.post("/msg", jwtMiddle, saveMSGInDB);
router.delete("/msg", jwtMiddle, deleteMsgInDB);
router.get("/msg/:convId", jwtMiddle, sendALlMsgAccConvId);
router.post("/msg/read", jwtMiddle, markAsReadUpdate);
router.get("/msg-unread", jwtMiddle, sendAllUnreadMSG);
router.post("/msg/verify", jwtMiddle, availableForSendingMsgOrNot);

// notification
router.post("/notification", jwtMiddle, saveNewNotification);
router.put("/notification", jwtMiddle, updateNotiClickOn);
router.get("/notification/count", jwtMiddle, sendNotiCount);
router.get("/notifications", jwtMiddle, sendAllNotifications);

// refresh token
router.post("/refresh-verify", generateRefresh);

// aws download
router.post("/aws/msg/download", jwtMiddle, sendURLForDownload);
export default router;
