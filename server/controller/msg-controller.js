import Message from "../model/message.js";
import Conversation from "../model/conversation.js";

export const saveMSGInDB = async (req, res) => {
  let { receiverId, conversationId, text } = req.body;
  try {
    const newMessage = new Message({
      receiverId: receiverId,
      conversationId: conversationId,
      senderId: req._id,
      text: text,
    });
    let result = await newMessage.save();
    console.log(result);
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: result._id,
    });
    return res.status(200).json("message sent succcessfully");
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const sendALlMsgAccConvId = async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.convId });

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
