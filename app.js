var createError = require("http-errors");
var express = require("express");
const { connecting } = require("./config/connecting");
connecting();
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var loginRouter = require("./routes/login");
var uploadRouter = require("./routes/Upload");
var searchRouter = require("./routes/Search");
var messageRouter = require("./routes/Message");
const { Chat } = require("./models/chatmodel");
require("dotenv").config();
var app = express();

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/users", usersRouter);
app.use("/upload", uploadRouter);
app.use("/search", searchRouter);
app.use("/message", messageRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
const server = app.listen("8000", () => {
  console.log("server started");
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.Frontend,
    // credentials: true,
  },
});
io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    // console.log(userData);
    socket.join(userData._id);
    // console.log("Connected to user ");
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    const rooms = Array.from(socket.rooms).filter((r) => (r !== socket.id));
    rooms.forEach((room) => {
      socket.leave(room);
      // console.log(`Left room: ${room}`);
    });
    socket.join(room);
    // console.log(socket.rooms)
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved;
    // console.log(chat);
    if (!chat.users) return console.log("chat.users not defined");
    io.in(chat.chat).emit("message received", newMessageRecieved);
    // chat.users.forEach((user) => {
    //   if (user != newMessageRecieved.sender) return;
    //   io.in(user).emit("message received", newMessageRecieved);
    //   console.log("sending to user", user);
    // });
  });

  socket.off("setup", () => {
    // console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
