require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Define the User schema
const userSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

// Create the User model
const User = mongoose.model("User", userSchema);
module.exports = { User };
