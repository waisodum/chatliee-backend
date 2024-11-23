const mongoose = require("mongoose");

// Create the message

const Schema = mongoose.Schema;

// Define the Post schema
const messageSchema = new Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String , trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readby: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  });
  
  const chatSchema = new Schema({
    chatName: { type: String, required: true },
    latestMessage: {type: mongoose.Schema.Types.ObjectId,ref: "Message",},
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  });

const Message = mongoose.model("Message", messageSchema);
const Chat = mongoose.model("Chat", chatSchema);
module.exports = { Message,Chat };
