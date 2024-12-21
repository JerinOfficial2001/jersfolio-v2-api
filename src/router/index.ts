import express from "express";
import authRoute from "./auth.route";
import userRouter from "./user.router";

const router = express.Router();

export default (): express.Router => {
  authRoute(router);
  userRouter(router);
  return router;
};
