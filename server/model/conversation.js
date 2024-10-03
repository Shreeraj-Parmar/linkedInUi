import mongoose from "mongoose";

const conversationSchema = mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
