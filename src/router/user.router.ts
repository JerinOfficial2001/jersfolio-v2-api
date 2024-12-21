import { isAuthenticated } from "../middlewares";
import { getAllUser } from "../controllers/user.controller";
import express from "express";

export default (router: express.Router) => {
  router.get("/users", isAuthenticated, getAllUser);
};
