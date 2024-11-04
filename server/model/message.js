import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: [true, "conversation id required"],
    },
    sender: {
      type: {
        type: String,
        enum: ["User", "Company"], // Specifies if the member is a user or company
        required: true,
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "senderId.type", // Dynamically reference either 'User' or 'Company' model
      },
      _id: false,
    },
    receiver: {
      type: {
        type: String,
        enum: ["User", "Company"], // Specifies if the member is a user or company
        required: true,
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "receiverId.type", // Dynamically reference either 'User' or 'Company' model
      },
      _id: false,
    },
    text: {
      type: String,
    },
    deletedBy: [
      {
        type: {
          type: String,
          enum: ["User", "Company"], // Specifies if the deleter is a user or company
        },
        id: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "deletedBy.type", // Dynamically reference 'User' or 'Company'
        },
        _id: false,
      },
    ],
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
