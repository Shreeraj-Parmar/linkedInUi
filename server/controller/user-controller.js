import User from "../model/user.js";
import Post from "../model/post.js";
import Comment from "../model/comment.js";
import Company from "../model/company.js";
import Notification from "../model/notification.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { io } from "../index.js";

// SignUp
export const saveNewUser = async (req, res) => {
  // console.log(req.body);
  try {
    let newBody = req.body;
    const saltRounds = 10;
    const password = newBody.password;
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      const newData = { ...newBody }; //copy
      delete newData.password; // delete password
      newData.hash = hash;

      let emailAvailable = await User.findOne({ email: newData.email });
      // check email available or not
      //   console.log("email available data", emailAvailable);
      if (emailAvailable) {
        console.log("email already exist");
        res.status(201).json({ message: "Email Already available" });
      } else {
        const accessToken = jwt.sign(
          { user: newData.email },
          process.env.JWT_SECRET,
          {
            expiresIn: "10m", // time
          }
        );
        const refreshToken = jwt.sign(
          { user: newData.email },
          process.env.JWT_REFRESH_SECRET,
          {
            expiresIn: "7d", // time
          }
        );
        let newUser = new User({ ...newData }); // block scope
        // console.log("new user withou jwt", newUser);
        // token
        let data = await newUser.save();
        // console.log(data);

        res.status(200).json({
          message: "user registered successfully",
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      }
    });
  } catch (error) {
    console.log(
      `error while calling saveNewuser API & error is ${error.messge}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login

export const checkLogin = async (req, res) => {
  try {
    const accessToken = jwt.sign(
      { user: req.body.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m", // time
      }
    );
    const refreshToken = jwt.sign(
      { user: req.body.email },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d", // time
      }
    );
    console.log("refresh is", refreshToken);
    let userHash = await User.findOneAndUpdate(
      { email: req.body.email },
      { $set: { refreshToken: refreshToken } },
      { new: true } // Options
    );
    // console.log("user hash", userHash);
    if (userHash) {
      bcrypt.compare(req.body.password, userHash.hash, function (err, result) {
        if (result) {
          if (userHash.isAdmin) {
            console.log("we are sending token in 204 token", accessToken);
            console.log(
              "we are sending token in 204 refreshToken",
              refreshToken
            );
            res.status(202).json({
              message: "login successful",
              accessToken: accessToken,
              refreshToken: refreshToken,
            });
          } else {
            res.status(200).json({
              message: "login successful",
              accessToken: accessToken,
              refreshToken: refreshToken,
            });
          }
        } else {
          res.status(201).json({ message: "invalid Email or Password" });
        }
      });
    } else {
      res.status(201).json({ message: "invalid Email or Password" });
    }
  } catch (error) {
    console.log(
      `error while calling checkLogin API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Send All Data {get}
export const sendAllData = async (req, res) => {
  try {
    let allData = await User.find();
    res.status(200).json({ message: allData });
  } catch (error) {
    console.log(
      `error while calling sendAllData API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ckeck profile url is available or not
export const checkURL = async (req, res) => {
  try {
    let isURL = await User.findOne({ email: req.user });
    console.log(isURL);
    if (isURL.profilePicture) {
      res.status(200).json({ url: isURL.profilePicture });
    } else {
      res
        .status(201)
        .json({ message: "URL Not Available please upload profile picture" });
    }
  } catch (error) {
    console.log(`error while calling checkURL API & error is ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// send user data for profile view

export const sendUserData = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.user }).populate({
      path: "company",
      select: "name profilePicture createdAt industry companySize",
    });

    // console.log(user);
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(201).json({ message: "user not available" });
    }
  } catch (error) {
    console.log(
      `error while calling sendUserData API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// save education field
export const saveEDUDetails = async (req, res) => {
  // console.log(req.body);
  console.log("email", req.user);
  try {
    let updateUser = await User.findOneAndUpdate(
      { email: req.user }, // Ensure req.user is correct
      { $push: { education: req.body } }, // Push to the education array
      { new: true } // Returns the updated document
    );

    // console.log("user is updated", updateUser);
    if (updateUser) {
      res.status(200).json({ message: "edu added successfully" });
    } else {
      res.status(201).json({ message: "user not available" });
    }
  } catch (error) {
    console.log(
      `error while calling saveEDUDetails API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// send data according to city
export const sendDataAccCity = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Set default values for page and limit
    let data = await User.findOne({ email: req.user });

    let dataAccCity = await User.find({
      city: data.city,
      _id: { $ne: data._id }, // Exclude the current user
    })
      .select("city profilePicture name role ")
      .skip((page - 1) * limit) // Skip documents based on the current page
      .limit(parseInt(limit)); // Limit the number of documents returned

    if (dataAccCity) {
      res.status(200).json({ dataAccCity });
    } else {
      res.status(404).json({ message: "No users found" });
    }
  } catch (error) {
    console.log(
      `Error while calling sendDataAccCity API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// save follow in db

export const saveFollow = async (req, res) => {
  let { receiverId, receverType, senderId, senderType } = req.body;
  console.log(req.body);
  try {
    const ReceiverModel = receverType === "User" ? User : Company;
    const SenderModel = senderType === "User" ? User : Company;

    const receiver = await ReceiverModel.findOne({ _id: receiverId }).select(
      "followers following connections"
    );
    const sender = await SenderModel.findOne({ _id: senderId }).select(
      "followers following connections"
    );

    // console.log("And Receever is now is", receiver);
    // console.log("And sender is now is", sender);
    if (!receiver || !sender) {
      return res.status(404).json({ message: "User not found" });
    }

    // Define objects for following and follower entries
    const senderData = { id: sender._id, type: senderType };
    const receiverData = { id: receiver._id, type: receverType };

    // Check if the sender is already following the receiver
    const isFollowing = receiver.followers?.some(
      (follower) => follower?.id?.toString() === sender._id.toString()
    );

    // Check if sender is already following the receiver
    if (isFollowing) {
      // Unfollow logic
      receiver.followers = receiver.followers.filter(
        (follower) => follower?.id?.toString() !== sender._id.toString()
      );
      sender.following = sender.following.filter(
        (following) => following?.id?.toString() !== receiver._id.toString()
      );
      // Remove the connection if it exists

      if (senderData.type === "User" && receiverData.type === "User") {
        receiver.connections = receiver.connections.filter(
          (connectionId) => connectionId.toString() !== sender._id.toString()
        );
        sender.connections = sender.connections.filter(
          (connectionId) => connectionId.toString() !== receiverId.toString()
        );
      }
      await receiver.save();
      await sender.save();
      return res
        .status(200)
        .json({ message: ` You are no longer following the ${receverType}` });
    } else {
      // Follow logic
      receiver.followers.push(senderData);
      sender.following.push(receiverData);

      await receiver.save();
      await sender.save();
      return res
        .status(200)
        .json({ message: `Now you are following the ${receverType}` });
    }
  } catch (error) {
    console.error(`Error in saveFollow: ${error.message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// check follow or not!

export const checkFollowOrNot = async (req, res) => {
  let { userId } = req.params;
  try {
    const { userId } = req.params; // The user to check if being followed
    const currentUser = req._id;
    const user = await User.findById(currentUser);
    if (!user) {
      return res.status(404).json({ message: "Current user not found" });
    }

    const isFollowing = user.following.includes(userId); // boolean
    // console.log(isFollowing);
    res.status(200).json({ isFollowing });
  } catch (error) {
    console.log(
      `error while calling checkFollowOrNot API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//send followers list || Following List
export const sendFollowerOrFollowingList = async (req, res) => {
  let { what } = req.query; // 'what' can be 'followers', 'following', or 'connections'
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to limit of 10

  try {
    let user = await User.findById(req._id).select(`${what}`);

    // Check if 'what' is 'connections' to handle connections list differently
    let list;
    if (what === "connections") {
      list = await User.find({ _id: { $in: user.connections } })
        .select("name profilePicture city gender")
        .skip((page - 1) * limit)
        .limit(limit);
    } else {
      // For 'followers' or 'following'
      list = await User.find({ _id: { $in: user[what].map((f) => f.id) } })
        .select("name profilePicture city gender")
        .skip((page - 1) * limit)
        .limit(limit);
    }

    // Add isFollowing status if what is not 'connections'
    let modifiedList = await Promise.all(
      list.map(async (userInList) => {
        let isFollowing = false;
        if (what !== "connections") {
          isFollowing = await User.exists({
            _id: req._id,
            following: { $elemMatch: { id: userInList._id, type: "User" } },
          });
        }
        return {
          ...userInList.toObject(),
          isFollowing: what !== "connections" ? !!isFollowing : undefined, // Only include isFollowing if relevant
        };
      })
    );

    if (modifiedList) {
      res.status(200).json({ list: modifiedList });
    }
  } catch (error) {
    console.log(
      `Error while calling sendFollowerOrFollowingList API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// send Connection counts initially
export const sendConnectionCount = async (req, res) => {
  try {
    let user = await User.findById(req._id).select("connections -_id");
    console.log(user.connections.length);
    if (user) {
      res.status(200).json(user.connections.length);
    }
  } catch (error) {
    console.log(
      `error while calling sendConnectionCount API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// send all connections lists
export const sendAllConnectionReq = async (req, res) => {
  try {
    // Find the user by ID and select the connectionRequests field
    let user = await User.findById(req._id)
      .select("connectionRequests -_id") // Fetch only the connectionRequests
      .populate({
        path: "connectionRequests.user", // Populating the user field inside connectionRequests
        select: "name city gender profilePicture", // Specify the fields you want to retrieve for each connection request
      });

    // Check if the user or their connection requests exist
    if (!user || !user.connectionRequests) {
      return res.status(404).json({ message: "No connection requests found." });
    }

    // Map through the connectionRequests to return user data along with isRead status
    const connectionRequests = user.connectionRequests.map((req) => ({
      user: req.user, // The populated user details
      isRead: req.isRead, // Include isRead status
    }));

    console.log("all connection req is : ", connectionRequests);

    // Respond with the populated connection request details
    res.status(200).json({ connectionRequests });
  } catch (error) {
    console.log(
      `Error while calling sendAllConnectionReq API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// update connection req
export const updateConnectionInDB = async (req, res) => {
  // console.log(req.body);
  let { receiverId, reqStatus } = req.body;

  try {
    // Find sender and receiver details
    let sender = await User.findById(req._id).select(
      "connectionRequests connections followers following"
    );
    let receiver = await User.findById(receiverId).select(
      "connections followers following"
    );

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    // Define data objects for sender and receiver
    const senderData = { id: sender._id, type: "User" };
    const receiverData = { id: receiver._id, type: "User" };

    // Case 1: If reqStatus is true (accepted)
    if (reqStatus) {
      // Add receiverId to sender's connections if not included
      if (!sender.connections.includes(receiverId)) {
        sender.connections.push(receiverId);
      }

      if (!receiver.connections.includes(sender._id)) {
        receiver.connections.push(sender._id);
      }

      // Add receiverId to sender's following if not included
      if (
        !sender.following.some((follow) => follow.id.toString() === receiverId)
      ) {
        sender.following.push(receiverData);
      }

      // Add sender to receiver's followers list
      if (
        !receiver.followers.some(
          (follower) => follower.id.toString() === sender._id
        )
      ) {
        receiver.followers.push(senderData);
      }

      // Remove receiverId from sender's connectionRequests if included
      if (sender.connectionRequests.includes(receiverId)) {
        sender.connectionRequests = sender.connectionRequests.filter(
          (id) => id.toString() !== receiverId.toString()
        );
      }

      // Add sender's id to receiver's followers if not included
      sender.connectionRequests = sender.connectionRequests.filter(
        (req) => req.user.toString() !== receiverId.toString()
      );
    } else {
      // Case 2: If reqStatus is false (rejected)

      // Remove receiverId from sender's connectionRequests if included
      sender.connectionRequests = sender.connectionRequests.filter(
        (req) => req.user.toString() !== receiverId.toString()
      );

      // Remove receiver from sender's following list
      sender.following = sender.following.filter(
        (follow) => !(follow.id.toString() === receiverId)
      );

      // Remove receiverId from sender's connections if included
      if (sender.connections.includes(receiverId)) {
        sender.connections = sender.connections.filter(
          (id) => id.toString() !== receiverId.toString()
        );
      }
    }

    // Save the updated data for both sender and receiver
    await sender.save();
    await receiver.save();

    if (reqStatus) {
      res.status(200).json({ message: "Accepted" });
    } else {
      res.status(201).json({ message: "Rejected" });
    }
  } catch (error) {
    console.log(
      `Error while calling updateConnectionInDB API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// send connection req
export const sendConnectReq = async (req, res) => {
  let { receiverId } = req.body;

  try {
    // Find sender and receiver details
    let sender = await User.findById(req._id).select(
      "connections followers following"
    );
    let receiver = await User.findById(receiverId).select(
      "connections followers connectionRequests following"
    );

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    const senderData = { id: sender._id, type: "User" };
    const receiverData = { id: receiver._id, type: "User" };

    // Check if connection request already exists
    const existingRequest = receiver.connectionRequests.some(
      (req) => req.user.toString() === sender._id.toString()
    );

    if (!existingRequest) {
      // Add connection request
      receiver.connectionRequests.push({ user: sender._id, isRead: false });

      // Add sender to receiver's followers if not already following
      const isAlreadyFollowing = receiver.followers.some(
        (follower) => follower.id.toString() === sender._id.toString()
      );
      if (!isAlreadyFollowing) {
        receiver.followers.push(senderData);
      }

      // Add receiver to sender's following if not already followed
      const isAlreadyFollowingReceiver = sender.following.some(
        (following) => following.id.toString() === receiverId
      );
      if (!isAlreadyFollowingReceiver) {
        sender.following.push(receiverData);
      }

      // Save the updated data for both sender and receiver
      await sender.save();
      await receiver.save();

      // Emit socket event for new connection request
      io.emit(`new_connection_request_${receiverId}`, "new request");

      res.status(200).json({ message: "Connection request sent" });
    } else {
      res.status(201).json({ message: "Connection request already exists" });
    }
  } catch (error) {
    console.log(`Error while calling sendConnectReq API: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// send connection req count
export const sendConnectReqCount = async (req, res) => {
  try {
    let user = await User.findById(req._id).select("connectionRequests");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const unreadCount = user.connectionRequests.filter(
      (req) => req.isRead === false
    ).length;

    // const unreadCount = user.connectionRequests.length;

    console.log("Unread connection requests count: ", unreadCount);
    res.status(200).json({ count: unreadCount });
  } catch (error) {
    console.log(
      `Error while calling sendConnectReqCount API: ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// update isRead:true
export const UpdateConnectReqRead = async (req, res) => {
  console.log(`UpdateConnectReqRead API hit
    
    
    okey ........................`);
  try {
    // Update all connection requests where isRead is false to true
    await User.findByIdAndUpdate(
      req._id,
      {
        $set: { "connectionRequests.$[elem].isRead": true },
      },
      {
        arrayFilters: [{ "elem.isRead": false }], // Only update unread connection requests
        multi: true, // Update multiple connection requests if necessary
        new: true, // Return the modified document
      }
    );

    res
      .status(200)
      .json({ message: "All unread connection requests marked as read" });
  } catch (error) {
    console.log(
      `Error while calling UpdateConnectReqRead API: ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// refresh token
export const generateRefresh = async (req, res) => {
  console.log("hitted");
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(403)
      .json({ message: "Refresh token not found, login again" });
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // console.log("payload is now", payload);

    let user = await User.findOne({ email: payload.user });
    // console.log(user);

    if (!user || user.refreshToken !== refreshToken) {
      console.log("salvana");
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { user: payload.user },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m", // time
      }
    );
    // console.log("new access token is :", newAccessToken);
    return res.status(200).json({ accessToken: accessToken });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

// send all users which is not connected each other

export const sendAllUsersWhichNotConnected = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided
  const userId = req._id; // Get the user ID from the request

  try {
    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calculate the number of users to skip for pagination
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch users who are not connected and haven't sent a connection request to the current user
    let allUsers = await User.find({
      $and: [
        { _id: { $ne: userId } }, // Exclude the current user
        { connections: { $ne: userId } }, // Exclude if userId is in connections array
        { "connectionRequests.user": { $ne: userId } }, // Exclude if userId is in connectionRequests array
      ],
    })
      .select("name city _id profilePicture") // Select only the fields name, city, _id, and profilePicture
      .sort({ createdAt: -1 }) // Sort by creation date, latest first
      .skip(skip) // Skip the users according to pagination
      .limit(limitNumber); // Limit the number of users fetched

    res.status(200).json({ allUsers });
  } catch (error) {
    console.log(
      `Error while calling sendAllUsersWhichNotConnected API & error is: ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// widhdraw connection req

export const withdrawReq = async (req, res) => {
  try {
    let updatUser = await User.findByIdAndUpdate(
      req.body.userId,
      {
        $pull: { connectionRequests: { user: req._id } },
      },
      { new: true }
    );
    // console.log("updated user is", updatUser);
    res
      .status(200)
      .json({ message: "Connection request withdrawn successfully" });
  } catch (error) {
    console.log(
      `Error while calling withdrawReq API & error is: ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// update user favorite
export const updateUserFavouriteInDB = async (req, res) => {
  const { receiverId, receiverType, senderId, senderType } = req.body;

  if (!receiverId || !receiverType || !senderId || !senderType) {
    return res.status(400).json({
      message: "Receiver ID, type, sender ID, and sender type are required",
    });
  }

  try {
    // Find the sender (user or company) to check if the receiver is already in the favorites array
    const sender =
      senderType === "User"
        ? await User.findById(senderId)
        : await Company.findById(senderId);

    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    const favoriteItem = { id: receiverId, type: receiverType };
    let updateQuery;

    // Check if the receiver is already in the favorites array
    const isFavorite = sender.favorites.some(
      (favorite) =>
        favorite.id.toString() === receiverId.toString() &&
        favorite.type === receiverType
    );

    if (isFavorite) {
      // Remove from favorites
      updateQuery = { $pull: { favorites: favoriteItem } };
    } else {
      // Add to favorites
      updateQuery = { $addToSet: { favorites: favoriteItem } };
    }

    // Update the sender document
    const updatedSender =
      senderType === "User"
        ? await User.findByIdAndUpdate(senderId, updateQuery, { new: true })
        : await Company.findByIdAndUpdate(senderId, updateQuery, { new: true });

    res.status(200).json({
      message: updatedSender.favorites.some(
        (fav) =>
          fav.id.toString() === receiverId.toString() &&
          fav.type === receiverType
      )
        ? "Added to favourites"
        : "Removed from favourites",
    });
  } catch (error) {
    console.error(
      `Error while calling updateUserFavouriteInDB API: ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// update user profile into db
export const updateUserProfileInDb = async (req, res) => {
  console.log(req.body);
  try {
    let updatUser = await User.findByIdAndUpdate(
      req._id,
      {
        $set: {
          name: req.body.name,
          city: req.body.city,
          country: req.body.country,
          state: req.body.state,
          heading: req.body.heading,
          about: req.body.about,
          role: req.body.role,
          website: {
            link: req.body.link,
            linkText: req.body.linkText,
          },
          skills: req.body.skills,
        },
      },
      { new: true }
    );
    console.log("updated user is", updatUser);
    res.status(200).json({ message: "profile updated successfully" });
  } catch (error) {
    console.log(
      updateUserProfileInDb`Error while calling updateUserProfileInDb API & error is: ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// send user according search for add new admin

export const sendUsersAccQueryForAdminSearch = async (req, res) => {
  const { query } = req.query;
  try {
    const users = await User.find({
      name: { $regex: query, $options: "i" }, // 'i' for case-insensitive
    })
      .limit(8)
      .select("name role heading city profilePicture");

    res.status(200).json(users);
  } catch (error) {
    console.log(
      `Error while calling sendUsersAccQueryForAdminSearch API & error is: ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};
