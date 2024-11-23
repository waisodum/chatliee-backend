var express = require("express");
var router = express.Router();
const { User } = require("../models/userSchema");
const passport = require("passport");
require("../config/passport");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { firstname: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
            { username: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    try {
      const users = await User.find(keyword).find({
        _id: { $ne: req.user._id },
      });
      res.send(users);
    } catch (err) {
      res.status(400).send("error");
    }
  }
);

module.exports = router;
