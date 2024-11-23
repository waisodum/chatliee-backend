require("dotenv").config();
const mongoose = require("mongoose");
async function connecting() {
  await mongoose
    .connect(process.env.Uri)
    .then(() => {
      console.log("connected to db");
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports={connecting}