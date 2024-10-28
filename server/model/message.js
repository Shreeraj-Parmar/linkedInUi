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
    deletedBy: [
      {
        type: {
          type: String,
          enum: ["User", "Company"], // Specifies if the deleter is a user or company
          required: true,
        },
        id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: "deletedBy.type", // Dynamically reference 'User' or 'Company'
        },
        _id: false,
      },
    ], // Ar
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
