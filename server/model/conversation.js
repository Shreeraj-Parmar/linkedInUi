import mongoose from "mongoose";

const conversationSchema = mongoose.Schema(
  {
    members: [
      {
        type: {
          type: String,
          enum: ["User", "Company"], // Specifies if the member is a user or company
          required: true,
        },
        id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: "members.type", // Dynamically reference either 'User' or 'Company' model
        },
        _id: false,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },

    unreadMessages: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
