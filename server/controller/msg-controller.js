import Message from "../model/message.js";
import Conversation from "../model/conversation.js";
import User from "../model/user.js";
import { io, socketClient } from "../index.js";
import mongoose from "mongoose";

export const saveMSGInDB = async (req, res) => {
  const {
    receiverId,
    receiverType,
    senderId,
    senderType,
    conversationId,
    text,
    mediaUrl,
  } = req.body;

  try {
    // Construct the new message object based on the presence of mediaUrl
    const newMessageData = {
      conversationId,
      sender: {
        id: senderId,
        type: senderType,
      },
      receiver: {
        id: receiverId,
        type: receiverType,
      },
      text,
    };

    // If mediaUrl is provided, add it to the message object
    if (mediaUrl) {
      newMessageData.mediaUrl = {
        url: mediaUrl.url,
        fileType: mediaUrl.fileType,
      };
    }

    // Save the new message
    const newMessage = new Message(newMessageData);
    const result = await newMessage.save();

    // Update the conversation's lastMessage field
    const conversation = await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: result._id,
    });

    // Emit the message to the conversation room
    const message = {
      ...newMessageData,
      _id: result._id,
      createdAt: new Date(),
    };

    io.to(conversationId).emit("receive_message", message);

    // Update unread messages count
    if (conversation.unreadMessages.has(receiverId)) {
      conversation.unreadMessages.set(
        receiverId,
        conversation.unreadMessages.get(receiverId) + 1
      );
    } else {
      conversation.unreadMessages.set(receiverId, 1);
    }

    // Live update badge notification for receiver
    const liveBadge = {
      receiverId,
      count: conversation.unreadMessages.get(receiverId),
      conversationId,
    };
    io.emit(`unread_messages_${receiverId}`, liveBadge);
    io.emit(`unread_messages_nav_${receiverId}`, "add please");

    await conversation.save();

    return res.status(200).json("message sent successfully");
  } catch (error) {
    console.error(error.message);
    return res.status(500).json(error.message);
  }
};

export const sendALlMsgAccConvId = async (req, res) => {
  const { convId, limit, page, whoId, whoType } = req.query;
  console.log("req qurey is the for the message", req.query);

  try {
    // Get page and limit from query parameters, with defaults
    // Calculate how many documents to skip based on the page number
    const skip = (page - 1) * limit;

    // Find messages for the specific conversation and apply pagination
    const messages = await Message.find({
      conversationId: convId,
      deletedBy: { $not: { $elemMatch: { id: whoId, type: whoType } } },
    })
      .sort({ createdAt: -1 }) // Sort by most recent messages first
      .skip(skip) // Skip the documents for previous pages
      .limit(limit); // Limit the number of documents returned

    console.log("messages are", messages);

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

// mark as read msg
export const markAsReadUpdate = async (req, res) => {
  // console.log(req.body);
  const { convId, userId } = req.body;
  try {
    const conv = await Conversation.findById(convId);

    // console.log("conv is............", conv);

    // console.log("before......conv.unread", conv.unreadMessages);

    if (!conv.unreadMessages) {
      conv.unreadMessages = new Map();
    }
    // console.log("after......conv.unread", conv.unreadMessages);

    if (conv.unreadMessages.has(userId)) {
      conv.unreadMessages.set(userId, 0);
    }

    let result = await conv.save();

    // console.log(result);

    if (result) {
      return res.status(200).json({ message: "Message seen.." });
    }
  } catch (error) {
    console.log(
      `error while calling markAsReadUpdate & error is : ${error.message}`
    );
    return res.status(500).json(error.message);
  }
};

// send all unread msg for show in navbar

export const sendAllUnreadMSG = async (req, res) => {
  const { reqId, reqIdType } = req.query; // Company or User ID and type

  try {
    // Convert reqId to ObjectId before using it in the aggregation
    const objectIdReqId = new mongoose.Types.ObjectId(reqId);

    // Query to find all conversations where the user/company is a member and has unread messages
    const allUnreadConversations = await Conversation.aggregate([
      {
        $match: {
          members: {
            $elemMatch: { id: objectIdReqId, type: reqIdType }, // Check membership with both id and type
          },
          [`unreadMessages.${reqId}`]: { $gt: 0 }, // Filter by conversations with unread messages for reqId
        },
      },
      {
        $group: {
          _id: null, // Group all conversations together to calculate the total unread count
          totalUnread: { $sum: { $toInt: `$unreadMessages.${reqId}` } }, // Sum the unread message count for reqId
        },
      },
    ]);

    // Determine the total unread count, defaulting to 0 if there are no unread messages
    const unreadCount =
      allUnreadConversations.length > 0
        ? allUnreadConversations[0].totalUnread
        : 0;

    return res.status(200).json(unreadCount);
  } catch (error) {
    console.log(
      `Error while calling sendAllUnreadMSG & error is: ${error.message}`
    );
    return res.status(500).json(error.message);
  }
};

// check if user for sending message to other user available or not via chaking connections

export const availableForSendingMsgOrNot = async (req, res) => {
  // console.log("recever id body is", req.body.receiverId);
  try {
    const sender = await User.findById(req._id).select("connections");
    const receiver = await User.findById(req.body.receiverId).select(
      "connections"
    );

    if (
      sender.connections.includes(receiver._id) &&
      receiver.connections.includes(sender._id)
    ) {
      res.status(200).json("now you can message");
    } else {
      res.status(201).json("you can not send msg untile not connected !");
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

// delete msgs inside database

export const deleteMsgInDB = async (req, res) => {
  const { deletedMsgList, deleteFor } = req.query;

  console.log("deleted msg list is", req.query);
  try {
    const messageIds = deletedMsgList.map((msg) => msg._id);

    if (deleteFor === "me") {
      await Message.updateMany(
        { _id: { $in: messageIds } },
        { $push: { deletedBy: req._id } }
      );
      return res.status(200).json("deleted for you successfully");
    } else if (deleteFor === "every") {
      const conversationId = deletedMsgList[0].conversationId;

      // Find the latest message in this conversation that is not being deleted
      const latestMessage = await Message.findOne({
        conversationId: conversationId,
        _id: { $nin: messageIds }, // Exclude the messages that are being deleted
      })
        .sort({ createdAt: -1 }) // Sort by creation time, most recent first
        .limit(1); // Only get the latest one

      if (latestMessage) {
        // Update the lastMessage field of the conversation
        await Conversation.updateOne(
          { _id: conversationId },
          { $set: { lastMessage: latestMessage._id } }
        );
      } else {
        // If there are no more messages, set lastMessage to null
        await Conversation.updateOne(
          { _id: conversationId },
          { $set: { lastMessage: null } }
        );
      }

      const result = await Message.deleteMany({
        _id: { $in: messageIds },
      });

      // console.log("result is", result);
      return res.status(200).json("deleted for everyOne successfully");
    }
  } catch (error) {
    console.log("error while calling deleteMsgInDB", error.message);
    return res.status(500).json(error.message);
  }
};
