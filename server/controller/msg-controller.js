import Message from "../model/message.js";
import Conversation from "../model/conversation.js";
import User from "../model/user.js";
import { io, socketClient } from "../index.js";

export const saveMSGInDB = async (req, res) => {
  let { receiverId, conversationId, text, mediaUrl } = req.body;
  try {
    const newMessage = mediaUrl
      ? new Message({
          receiverId: receiverId,
          conversationId: conversationId,
          senderId: req._id,
          text: text,
          mediaUrl: mediaUrl && mediaUrl,
        })
      : new Message({
          receiverId: receiverId,
          conversationId: conversationId,
          senderId: req._id,
          text: text,
        });
    let result = await newMessage.save();
    console.log(result);
    const conver = await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: result._id,
    });

    const message = mediaUrl
      ? {
          senderId: req._id,
          receiverId: receiverId,
          text: text,
          conversationId: conversationId,
          _id: result._id,
          mediaUrl: mediaUrl && mediaUrl,

          createdAt: new Date(),
        }
      : {
          senderId: req._id,
          receiverId: receiverId,
          text: text,
          conversationId: conversationId,
          _id: result._id,

          createdAt: new Date(),
        };

    io.to(conversationId).emit("receive_message", message);

    // update unreade messsssssage

    if (conver.unreadMessages.has(receiverId)) {
      conver.unreadMessages.set(
        receiverId,
        conver.unreadMessages.get(receiverId) + 1
      );
    } else {
      conver.unreadMessages.set(receiverId, 1);
    }

    // live update badge notification

    let liveBadge = {
      receiverId: receiverId,
      count: conver.unreadMessages.get(receiverId),
      conversationId: conversationId,
    };
    io.emit(`unread_messages_${receiverId}`, liveBadge);
    io.emit(`unread_messages_nav_${receiverId}`, "add please");

    await conver.save();

    return res.status(200).json("message sent succcessfully");
  } catch (error) {
    console.error(error.message);
    return res.status(500).json(error.message);
  }
};

export const sendALlMsgAccConvId = async (req, res) => {
  try {
    // Get page and limit from query parameters, with defaults
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 20; // Default limit to 20 if not provided

    // Calculate how many documents to skip based on the page number
    const skip = (page - 1) * limit;

    // Find messages for the specific conversation and apply pagination
    const messages = await Message.find({
      conversationId: req.params.convId,
      deletedBy: { $ne: req._id },
    })
      .sort({ createdAt: -1 }) // Sort by most recent messages first
      .skip(skip) // Skip the documents for previous pages
      .limit(limit); // Limit the number of documents returned

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
  // console.log(`Naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

  //  s`);
  try {
    const userId = req._id;

    // Query to find all conversations where the user is a member and has unread messages
    const allUnreadConversations = await Conversation.aggregate([
      {
        $match: {
          members: { $in: [userId] }, // Find conversations where the user is a member
          [`unreadMessages.${userId}`]: { $gt: 0 }, // Only return conversations where the user has unread messages
        },
      },
      {
        $group: {
          _id: null, // Group all conversations together to calculate the total
          totalUnread: { $sum: { $toInt: `$unreadMessages.${userId}` } }, // Sum the unread message count for the user
        },
      },
    ]);

    // If there are unread messages, return the count, otherwise return 0
    const unreadCount =
      allUnreadConversations.length > 0
        ? allUnreadConversations[0].totalUnread
        : 0;

    // console.log(`User hello ${userId} has ${unreadCount} unread messages.`);

    return res.status(200).json(unreadCount);
  } catch (error) {
    console.log(
      `error while calling sendAllUnreadMSG & error is : ${error.message}`
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
