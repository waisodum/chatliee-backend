var express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const { User } = require("../models/userSchema");
require("../config/passport");
var router = express.Router();
router.use(passport.initialize());

/* POST add user */
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  function (req, res, next) {
    const userId = req.user._id;
    const id = req.body._id; // Extract the `_id` from the request body
    console.log(id); // Log the received id
    try {
      const objectId = new mongoose.Types.ObjectId(id); // Convert the string id to an ObjectId
      console.log(objectId); // Log the converted ObjectId
      console.log(req.user);
      req.user.friends.push(objectId);
      req.user.save();
      
      res.send("success");
    } catch (error) {
      console.error("Invalid ObjectId:", error);
      res.status(400).send("Invalid ObjectId");
    }
  }
);

router.get(
  "/getFriends",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // console.log(req.user);
    const freinds = await req.user.populate({
      path: "friends",
      select: "-friends -password",
    });
    // console.log(freinds);
    res.json(freinds);
  }
);
module.exports = router;
