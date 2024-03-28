require("dotenv").config();
require("express-async-errors");
const mongoose = require("mongoose");
const express = require("express");

// database
const connectDB = require("./db/connect");
// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

mongoose.set("strictQuery", true);
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5001;
async function start() {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
}

start();
