import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    recipient: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "recipient.type", // Dynamically reference either 'User' or 'Company'
      },
      type: {
        type: String,
        enum: ["User", "Company"], // Specifies if the follower is a user or a company
        required: true,
      },
      _id: false,
    },
    sender: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "sender.type", // Dynamically reference either 'User' or 'Company'
      },
      type: {
        type: String,
        enum: ["User", "Company"], // Specifies if the follower is a user or a company
        required: true,
      },
      _id: false,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "connection_request", // New connection request
        "connection_accepted", // Connection accepted
        "connection_rejected", // Connection rejected
        "like", // Like on a post or comment
        "comment", // Comment on a post
        "mention", // Mention in a post or comment
        "follow", // New follower
        "job_recommendation", // Job recommendation
        "profile_view", // Profile view notification
        "message", // New message
        "event_invitation", // Event invitation
        "network_suggestion", // People you may know
      ],
    },

    isRead: {
      type: Boolean,
      default: false, // Whether the notification has been read
    },
    isClicked: {
      type: Boolean,
      default: false, // Whether the notification has been clicked (for tracking engagement)
    },
    message: {
      // Additional details that could be useful for displaying the notification
      type: String, // Custom message (e.g., "John Doe commented on your post")
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
