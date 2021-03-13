require("dotenv").config();
const mongoose = require("mongoose");
const debug = require("debug")("app:general");
const debugDB = require("debug")("app:db");
const cors = require("cors");
const express = require("express");

const homepage = require("../routes/home");
const todos = require("../routes/todos");

// Connection URL
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@twitch.g3bp4.mongodb.net/${process.env.DB_NAME}`;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Use connect method to connect to the server
mongoose.connect(url, options).then(() => {
  debugDB("Connected successfully to server");

  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true })); // key=value&key=value
  app.use(express.static("../../frontend/"));

  app.use("/", homepage);
  app.use("/api/todos", todos);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    if (process.env.NODE_ENV === "development") {
      debug(`Server listening on http://localhost:${PORT}/`);
    } else {
      console.log(`Server listening on http://localhost:${PORT}/`);
    }
  });
});
