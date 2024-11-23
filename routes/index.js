var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
var createUser = require("../models/userSchema").User;
const { hashSync, compareSync } = require("bcrypt");
router.get("/", (req, res) => {
  res.send("hiiiii");
});

router.post("/Register", async (req, res) => {
  var userName = req.body.username;
  var found;
  var email;
  // console.log(req.body);
  await createUser.findOne({ username: userName }).then((user) => {
    // console.log(user);
    found = user;
  });
  await createUser.findOne({ email: req.body.email }).then((user) => {
    // console.log(user);
    email = user;
  });

  if (found) {
    return res.send({ success: false, message: "Username Exists" });
  }
  if (email) {
    return res.send({ success: false, message: "email already exists" });
  }

  var data = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    password: await hashSync(req.body.password, 10),
    email: req.body.email,
  };

  // console.log(data);
  const user = new createUser(data);
  const payload = {
    username: user.username,
    id: user._id,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "14d" });
  await user
    .save()
    .then((user) => {
      res.send({
        success: true,
        message: "User created successfully",
        user: {
          id: user._id,
          username: user.username,
        },
        token: "Bearer " + token,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({
        success: false,
        message: "Something went wrong",
        error: err,
        errr: true,
      });
    });
});

router.delete("/delete", async (req, res, next) => {
  await createUser.deleteMany({}).then(() => {
    res.send("ok will do");
  });
  let data = await createUser.find({});
  console.log(data);
});

router.get("/favicon.ico ", (req, res) => {
  res.send("success");
});

module.exports = router;
