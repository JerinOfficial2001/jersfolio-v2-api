import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import router from "./router";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: true,
    // origin: process.env.CLIENT_URL,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const server = http.createServer(app);

server.listen(8080, () => {
  console.log(`server running on 8080`);
});
app.get("/", (req, res) => {
  res.send("Welcome to Jersfolio API");
});
const MONGO_URL = process.env.MONGO_URI;

mongoose.Promise = Promise;
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error: Error) => {
    console.error("MongoDB connection error:", error);
  });

app.use("/jersfolio/v2", router());

// Ensure the router is correctly set up
app.use((req, res, next) => {
  res.status(404).send("Sorry, that route doesn't exist.");
});
