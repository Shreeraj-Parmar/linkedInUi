import User from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
        console.log(data);

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
        expiresIn: "20m", // time
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
    console.log("user hash", userHash);
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
    let user = await User.findOne({ email: req.user });
    console.log(user);
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
    let data = await User.findOne({ email: req.user });
    let dataAccCity = await User.find({
      city: data.city,
      _id: { $ne: data._id }, // Exclude the current user based on _id
    }).select("city pincode profilePicture name gender _id");
    console.log(dataAccCity);

    if (dataAccCity) {
      res.status(200).json({ dataAccCity });
    } else {
      res.status(201).json({ message: "Somthing Error" });
    }
  } catch (error) {
    console.log(
      `error while calling sendDataAccCity API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// save follow in db

export const saveFollow = async (req, res) => {
  let { receiverId } = req.body;
  // console.log("reciever id is", receiverId);

  try {
    const receiver = await User.findById(receiverId).select(
      "followers following connections"
    );
    const sender = await User.findOne({ email: req.user }).select(
      "followers following connections"
    );

    // console.log("And Receever is now is", receiver);
    // console.log("And sender is now is", sender);
    if (!receiver || !sender) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if sender is already following the receiver
    if (receiver.followers.includes(sender._id)) {
      // Unfollow logic
      receiver.followers = receiver.followers.filter(
        (followerId) => followerId.toString() !== sender._id.toString()
      );
      sender.following = sender.following.filter(
        (followingId) => followingId.toString() !== receiverId.toString()
      );
      // Remove the connection if it exists
      receiver.connections = receiver.connections.filter(
        (connectionId) => connectionId.toString() !== sender._id.toString()
      );
      sender.connections = sender.connections.filter(
        (connectionId) => connectionId.toString() !== receiverId.toString()
      );
      await receiver.save();
      await sender.save();
      return res.status(200).json({ message: "You have unfollowed the user!" });
    } else {
      // Follow logic
      receiver.followers.push(sender._id);
      sender.following.push(receiverId);
      // Add connection if both users are now following each other
      if (
        sender.following.includes(receiverId) &&
        receiver.followers.includes(sender._id)
      ) {
        receiver.connections.push(sender._id);
        sender.connections.push(receiverId);
      }
      await receiver.save();
      await sender.save();
      return res
        .status(200)
        .json({ message: "Now you are following the user!" });
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
    console.log(isFollowing);
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
  let { what } = req.query;
  console.log("what is", what);
  try {
    if (what === "connections") {
      let user = await User.findById(req._id).select(`${what}`);

      // Fetch full details of the followers/following with user details like { id, name, profilePic, city }
      let list = await User.find({ _id: { $in: user[what] } }).select(
        "name profilePicture city gender"
      );

      console.log(list);
      if (list) {
        return res.status(200).json({ list: list });
      }
      return;
    }

    let user = await User.findById(req._id).select(`${what}`);

    // Fetch full details of the followers/following with user details like { id, name, profilePic, city }
    let list = await User.find({ _id: { $in: user[what] } }).select(
      "name profilePicture city gender"
    );
    // console.log(list);
    let modifiedList = await Promise.all(
      list.map(async (userInList) => {
        let isFollowing = await User.exists({
          _id: req._id,
          following: userInList._id,
        });
        return {
          ...userInList.toObject(),
          isFollowing: !!isFollowing, // Add isFollowing status
        };
      })
    );
    console.log(modifiedList);
    if (modifiedList) {
      res.status(200).json({ list: modifiedList });
    }
  } catch (error) {
    console.log(
      `error while calling sendFollowerList API & error is ${error.message}`
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
    // Find the user by ID and select the connectionRequests field (without _id)
    let user = await User.findById(req._id)
      .select("connectionRequests -_id") // Fetch only the connectionRequests
      .populate({
        path: "connectionRequests", // The field that contains the array of user references
        select: "name city gender", // Specify the fields you want to retrieve for each connection request
      });
    console.log(
      ".................../n/n .............. connection req of user is ",
      user
    );

    // Check if the user or their connection requests exist
    if (!user || !user.connectionRequests) {
      return res.status(404).json({ message: "No connection requests found." });
    }

    // Respond with the populated connection request details
    res.status(200).json({ connectionRequests: user.connectionRequests });
  } catch (error) {
    console.log(
      `Error while calling sendAllConnectionReq API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// update connection req
export const updateConnectionInDB = async (req, res) => {
  console.log(req.body);
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

    // Case 1: If reqStatus is true (accepted)
    if (reqStatus) {
      // Add receiverId to sender's connections if not included
      if (!sender.connections.includes(receiverId)) {
        sender.connections.push(receiverId);
      }

      // Add receiverId to sender's following if not included
      if (!sender.following.includes(receiverId)) {
        sender.following.push(receiverId);
      }

      // Add receiverId to sender's followers if not included
      if (!sender.followers.includes(receiverId)) {
        sender.followers.push(receiverId);
      }

      // Remove receiverId from sender's connectionRequests if included
      if (sender.connectionRequests.includes(receiverId)) {
        sender.connectionRequests = sender.connectionRequests.filter(
          (id) => id.toString() !== receiverId.toString()
        );
      }

      // Add sender's id to receiver's following if not included
      if (!receiver.following.includes(sender._id)) {
        receiver.following.push(sender._id);
      }

      // Add sender's id to receiver's followers if not included
      if (!receiver.followers.includes(sender._id)) {
        receiver.followers.push(sender._id);
      }
    } else {
      // Case 2: If reqStatus is false (rejected)

      // Remove receiverId from sender's connectionRequests if included
      if (sender.connectionRequests.includes(receiverId)) {
        sender.connectionRequests = sender.connectionRequests.filter(
          (id) => id.toString() !== receiverId.toString()
        );
      }

      // Remove receiverId from sender's following if included
      if (sender.following.includes(receiverId)) {
        sender.following = sender.following.filter(
          (id) => id.toString() !== receiverId.toString()
        );
      }

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

    res.status(200).json({ message: "Changes done" });
  } catch (error) {
    console.log(
      `Error while calling updateConnectionInDB API & error is ${error.message}`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};
