import { isAuthenticated } from "../middlewares";
import {
  deleteAllPortfolios,
  getPortfolio,
  getPortfolios,
  getPortfoliosWithUserID,
  publishPortfolio,
} from "../controllers/portfolio.controller";
import express from "express";

export default (router: express.Router) => {
  router.get("/allPortfolios", isAuthenticated, getPortfolios);
  router.delete("/allPortfolios", isAuthenticated, deleteAllPortfolios);
  router.get("/portfolios", isAuthenticated, getPortfolios);
  router.get("/portfolio", isAuthenticated, getPortfoliosWithUserID);
  router.get("/portfolio/:username", isAuthenticated, getPortfolio);
  router.put("/portfolio/publish", isAuthenticated, publishPortfolio);
};
