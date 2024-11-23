var express = require("express");
var router = express.Router();
var createUser = require("../models/userSchema").User;
const { compareSync } = require("bcrypt");

const jwt = require("jsonwebtoken");
const passport = require("passport");
router.use(passport.initialize());
require("../config/passport");

router.post("/", (req, res) => {
  // console.log(req.body);
  createUser.findOne({ username: req.body.username }).then((user) => {
    if (!user) {
      return res.send({
        success: false,
        message: "could not find the user.",
      });
    }
    if (!compareSync(req.body.password, user.password)) {
      return res.send({
        success: false,
        message: "Incorrect password",
      });
    }
    const payload = {
      username: user.username,
      id: user._id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "14d" });

    var UserData = {
      firstName: user.firstname,
      lastName: user.lastname,
      username: user.username,
      email: user.email,
      branch: user.Branch,
      year: user.Year,
    };
    return res.status(200).send({
      success: true,
      message: "loggedin successfully",
      User: UserData,
      token: "Bearer " + token,
    });
  });
});

router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var user = req.user;
    var UserData = {
      Id: user._id,
      firstName: user.firstname,
      lastName: user.lastname,
      username: user.username,
      email: user.email,
      branch: user.Branch,
      year: user.Year,
    };
    return res.send({ success: true, UserData });
  }
);

module.exports = router;
