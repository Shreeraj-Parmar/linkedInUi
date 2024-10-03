import Conversation from "../model/conversation.js";

export const newConversation = async (req, res) => {
  try {
    const senderId = req._id;
    const receiverId = req.body.receiverId;
    const exist = await Conversation.findOne({
      members: { $all: [receiverId, senderId] },
    });

    if (exist) {
      return res
        .status(200)
        .json({ message: "conversation already exist", id: exist._id });
    }

    const newConversation = new Conversation({
      members: [senderId, receiverId],
    });

    let result = await newConversation.save();
    console.log(result);
    return res
      .status(200)
      .json({ message: "conversation saved sucessfully", id: result._id });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

// send receiver data in curr conversation
export const sendReceiverData = async (req, res) => {
  try {
    const senderId = req._id; // Assuming the sender's ID is available from the request token/session
    const { convId } = req.body; // You might need to pass the conversation ID from the frontend request

    // Find the conversation by ID
    const conversation = await Conversation.findById(convId).populate(
      "members",
      "name"
    ); // Populate the members' names

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Find the receiver (the member who is not the sender)
    const receiver = conversation.members.find(
      (member) => member._id.toString() !== senderId.toString()
    );

    if (!receiver) {
      return res
        .status(404)
        .json({ message: "Receiver not found in the conversation" });
    }

    // Send the receiver's data in the response
    res.status(200).json({
      receiverId: receiver._id,
      receiverName: receiver.name,
    });
  } catch (error) {
    console.log(
      `error while calling sendReceiverData & error is : `,
      error.message
    );
    res.status(500).json({ message: "internal server error" });
  }
};

// send all conversation

export const sendAllConversations = async (req, res) => {
  try {
    const currUserId = req._id; // Assuming the sender's ID is available from the request token/session

    // console.log("curruserid is", req._id);
    // Step 1: Find all conversations where the current user is a member
    const conversations = await Conversation.find({
      members: { $in: [currUserId] },
    })
      .populate({
        path: "members", // Populate user details for each member
        select: "name profilePicture unreadMessages", // Only get the user's name and profilePic & unread...
      })
      .populate({
        path: "lastMessage", // Populate the last message
        select: "text createdAt senderId", // Only get the message text and createdAt time
      });

    if (!conversations) {
      return res.status(404).json({ message: "No conversations found" });
    }

    // Step 2: Format conversations to return receiver's details and last message
    const formattedConversations = conversations.map((conversation) => {
      // Find the receiver by excluding the current user from the members list
      const receiver = conversation.members.find(
        (member) => member._id.toString() !== currUserId.toString()
      );

      // console.log("reciever is", receiver);
      const lastMessage = conversation.lastMessage;

      return {
        conversationId: conversation._id,
        receiverId: receiver._id,
        receiverName: receiver.name,
        unreadMessages: conversation.unreadMessages,

        receiverProfilePicture: receiver.profilePicture,
        lastMessage: conversation.lastMessage
          ? conversation.lastMessage.text
          : "No messages yet",
        lastMessageTime: conversation.lastMessage
          ? conversation.lastMessage.createdAt
          : null,
        lastMessageSenderId: lastMessage?.senderId || null, // Safely access senderId
      };
    });

    // Step 3: Send the formatted conversation data
    res.status(200).json(formattedConversations);
  } catch (error) {
    console.log(
      `error while calling sendAllConversations & error is : `,
      error.message
    );
    res.status(500).json({ message: "internal server error" });
  }
};
