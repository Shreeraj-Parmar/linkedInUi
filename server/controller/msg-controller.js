import Message from "../model/message.js";
import Conversation from "../model/conversation.js";

export const saveMSGInDB = async (req, res) => {
  let { receiverId, conversationId, text } = req.body;
  try {
    const newMessage = new Message({
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

    // update unreade messsssssage

    if (conver.unreadMessages.has(receiverId)) {
      conver.unreadMessages.set(
        receiverId,
        conver.unreadMessages.get(receiverId) + 1
      );
    } else {
      conver.unreadMessages.set(receiverId, 1);
    }

    await conver.save();

    return res.status(200).json("message sent succcessfully");
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const sendALlMsgAccConvId = async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.convId });

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
  console.log(`Naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    
    
    asdasd858585
    
    asssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
    
    
    
    
    asssssssssssssssssssssssssssssssss`);
  try {
    const userId = req._id; // Assuming req._id holds the user ID

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

    console.log(`User hello ${userId} has ${unreadCount} unread messages.`);

    return res.status(200).json(unreadCount);
  } catch (error) {
    console.log(
      `error while calling sendAllUnreadMSG & error is : ${error.message}`
    );
    return res.status(500).json(error.message);
  }
};
