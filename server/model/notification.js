import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // The user who receives the notification
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // The user who triggers the notification (can be null for system notifications)
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
        // Add other LinkedIn-like notifications here
      ],
    },
    entity: {
      // This field can refer to different types of entities depending on the notification type.
      post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post", // Reference to the Post if the notification is about a post
      },
      comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment", // Reference to the Comment if the notification is about a comment
      },
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
