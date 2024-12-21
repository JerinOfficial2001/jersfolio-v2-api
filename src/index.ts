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
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());

const server = http.createServer(app);

server.listen(8080, () => {
  console.log(`server running on 8080`);
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
