import express from "express";
import authRoute from "./auth.route";
import userRoute from "./user.route";
import portfolioRoute from "./portfolio.route";
import projectRoute from "./project.route";
import educationRoute from "./education.route";
import experienceRoute from "./experience.route";
import skillRoute from "./skill.route";

const router = express.Router();

export default (): express.Router => {
  authRoute(router);
  userRoute(router);
  portfolioRoute(router);
  projectRoute(router);
  educationRoute(router);
  experienceRoute(router);
  skillRoute(router);
  return router;
};
