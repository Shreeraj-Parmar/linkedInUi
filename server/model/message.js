import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: [true, "conversation id required"],
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "senderId required"],
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "recieverId required"],
    },
    text: {
      type: String,
    },
    deletedBy: {
      type: [mongoose.Schema.Types.ObjectId], // Stores the user IDs of users who have deleted the message
      default: [],
    },
    mediaUrl: {
      url: String,
      fileType: String,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
