import {
  getPortfolio,
  publishPortfolio,
} from "../controllers/portfolio.controller";
import express from "express";

export default (router: express.Router) => {
  router.get("/portfolio/:username", getPortfolio);
  router.put("/portfolio/:id", publishPortfolio);
};
