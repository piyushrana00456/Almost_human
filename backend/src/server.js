require("dotenv").config();
const express = require("express");
const connect = require("./config/db");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const Pusher = require("pusher");
const mongoose = require("mongoose");
app.use(cors());
app.use(express.json());

const pusher = new Pusher({
  appId: "1300781",
  key: "dad35ca4556ca6ecf0c3",
  secret: "96a47e8a64ab32fceed9",
  cluster: "ap2",
  encrypted: true,
});

// Controllers
const userController = require("./controllers/users.controller");
const {
  userRegister,
  userLogin,
} = require("./controllers/userAuth.controller");
const {
  driverRegister,
  driverLogin,
} = require("./controllers/driverAuth.controllers");
const packageController = require("./controllers/package.controller");

const connectDB = async () => {
  await connect();
};
connectDB();

app.use("/user-login", userLogin);
app.use("/user-register", userRegister);
app.use("/driver-login", driverLogin);
app.use("/driver-register", driverRegister);
app.use("/users", userController);
app.use("/package", packageController);

///
///
///
const PORT = process.env.PORT;

const db = mongoose.connection;
const channel = "package";
db.on("error", console.error.bind(console, "Connection Error:"));

db.once("open", () => {
  const taskCollection = db.collection("packages");
  const changeStream = taskCollection.watch();

  changeStream.on("change", (change) => {
    console.log(change);

    if (change.operationType === "insert") {
      const package = change.fullDocument;
      console.log("Package", package);
      pusher.trigger("package", "inserted", {
        id: package._id,
        from: package.from,
        to: package.to,
        packageName: package.packageName,
        image: package.image,
        weight: package.weight,
      });
    } else if (change.operationType === "delete") {
      pusher.trigger(channel, "deleted", change.documentKey._id);
    } else {
      console.log("Error triggering Pusher");
    }
  });
});

module.exports = start = async () => {
  app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
  });
};
