import Notification from "../model/notification.js";
import User from "../model/user.js";
import Post from "../model/post.js";
import Comment from "../model/comment.js";

// save new notifiaction
export const saveNewNotification = async (req, res) => {
  //   console.log(req.body);
  try {
    let newNoti = new Notification(req.body);
    await newNoti.save();
    res.status(204);
  } catch (error) {
    console.log(
      `error while calling saveNewNotification API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// send count of notification that is unread

export const sendNotiCount = async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({
      recipient: req._id,
      isRead: false,
    });

    if (unreadCount && unreadCount > 0) {
      res.status(200).json(unreadCount);
    } else {
      res.status(201).json({ message: "no any notifications" });
    }
  } catch (error) {
    console.log(
      `error while calling sendNotiCount API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// send all notifications to te client

export const sendAllNotifications = async (req, res) => {
  try {
    // First, mark all unread notifications as read
    await Notification.updateMany(
      { recipient: req._id, isRead: false },
      { $set: { isRead: true } }
    );

    // Get pagination parameters from the request query
    const limit = parseInt(req.query.limit) || 12; // Default limit is 12
    const page = parseInt(req.query.page) || 1; // Default page is 1
    const skipCount = (page - 1) * limit; // Calculate how many notifications to skip

    // Fetch notifications with pagination
    let allNotifications = await Notification.find({ recipient: req._id })
      .sort({ createdAt: -1 }) // Sort notifications by creation date
      .populate({
        path: "sender",
        select: "name profilePicture",
      })
      .select("-isRead") // Exclude the 'isRead' field from the response
      .skip(skipCount) // Skip the specified number of notifications
      .limit(limit); // Limit the number of notifications returned

    // Return the fetched notifications
    if (allNotifications.length > 0) {
      res.status(200).json(allNotifications); // Return notifications with status 200
    } else {
      res.status(204).json({ message: "No more notifications" }); // No notifications found
    }
  } catch (error) {
    console.error(
      `Error while calling sendAllNotifications API: ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" }); // Handle errors
  }
};
