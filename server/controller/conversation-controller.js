import Conversation from "../model/conversation.js";

export const newConversation = async (req, res) => {
  const { senderId, senderType, receiverId, receiverType } = req.body;
  console.log("req.body is", req.body);

  try {
    // Check if a conversation with these members already exists
    const exist = await Conversation.findOne({
      members: {
        $all: [
          { type: senderType, id: senderId },
          { type: receiverType, id: receiverId },
        ],
      },
    });

    if (exist) {
      return res
        .status(200)
        .json({ message: "Conversation already exists", id: exist._id });
    }

    // Create a new conversation
    const newConversation = new Conversation({
      members: [
        { type: senderType, id: senderId },
        { type: receiverType, id: receiverId },
      ],
    });

    const result = await newConversation.save();
    console.log(result);
    return res
      .status(200)
      .json({ message: "Conversation saved successfully", id: result._id });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

// send receiver data in curr conversation
export const sendReceiverData = async (req, res) => {
  try {
    const senderId = req._id; // Assuming the sender's ID is available from the request token/session
    const { convId } = req.body; // Expecting conversation ID from the frontend request

    // Find the conversation by ID and populate members dynamically
    const conversation = await Conversation.findById(convId).populate({
      path: "members.id",
      select: "name profilePicture",
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Find the receiver by excluding the sender from the members list
    const receiver = conversation.members.find(
      (member) => member.id._id.toString() !== senderId.toString()
    );

    if (!receiver) {
      return res
        .status(404)
        .json({ message: "Receiver not found in the conversation" });
    }

    // Send the receiver's data in the response
    res.status(200).json({
      receiverId: receiver.id._id,
      receiverType: receiver.type, // Include type to identify if it's a User or Company
      receiverName: receiver.id.name,
      receiverProfilePicture: receiver.id.profilePicture,
    });
  } catch (error) {
    console.log(
      `Error while calling sendReceiverData & error is: `,
      error.message
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

// send all conversation

export const sendAllConversations = async (req, res) => {
  const { reqIdType, reqId } = req.query;
  try {
    // Step 1: Find all conversations where the current user is a member
    const conversations = await Conversation.find({
      "members.id": reqId, // Find conversations where the current user is a member
    })
      .populate({
        path: "members.id", // Populate the details for each member
        select: "name profilePicture", // Get necessary fields
      })
      .populate({
        path: "lastMessage", // Populate the last message details
        select: "text createdAt sender mediaUrl", // Get relevant fields for the last message
      });

    if (!conversations.length) {
      return res.status(404).json({ message: "No conversations found" });
    }

    // Step 2: Format conversations to return receiver's details and last message
    const formattedConversations = conversations.map((conversation) => {
      // Find the receiver by excluding the current user from the members list
      const receiver = conversation.members.find(
        (member) => member.id._id.toString() !== reqId.toString()
      );

      const lastMessage = conversation.lastMessage;

      return {
        conversationId: conversation._id,
        receiverId: receiver.id._id,
        receiverType: receiver.type,
        receiverName: receiver.id.name,
        receiverProfilePicture: receiver.id.profilePicture,
        unreadMessages: conversation.unreadMessages.get(reqId) || 0, // Get unread count for current user

        lastMessage: lastMessage
          ? lastMessage.mediaUrl && lastMessage.mediaUrl.url
            ? "Attachment Sent"
            : lastMessage.text
          : null,

        lastMessageTime: lastMessage ? lastMessage.createdAt : null,
        lastMessageSenderId: lastMessage?.sender.id || null, // Safely access senderId
      };
    });

    // Step 3: Send the formatted conversation data
    res.status(200).json(formattedConversations);
  } catch (error) {
    console.error(
      `Error while calling sendAllConversations & error is: `,
      error
    );
    res.status(500).json({ message: "Internal server error" });
  }
};
