import express from "express";
import authRoute from "./auth.route";
import userRoute from "./user.route";
import portfolioRoute from "./portfolio.route";
import projectRoute from "./project.route";

const router = express.Router();

export default (): express.Router => {
  authRoute(router);
  userRoute(router);
  portfolioRoute(router);
  projectRoute(router);
  return router;
};
