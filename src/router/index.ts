import express from "express";
import authRoute from "./auth.route";
import userRoute from "./user.route";
import portfolioRoute from "./portfolio.route";

const router = express.Router();

export default (): express.Router => {
  authRoute(router);
  userRoute(router);
  portfolioRoute(router);
  return router;
};
