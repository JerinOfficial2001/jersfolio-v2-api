import express from "express";
import { isAuthenticated } from "../middlewares";
import {
  addExperience,
  deleteExperience,
  deleteExperiences,
  getExperienceByExperienceId,
  getExperienceByUserId,
  getExperiences,
  updateExperience,
} from "../controllers/experience.controller";

export default (router: express.Router) => {
  router.get("/allexperiences", isAuthenticated, getExperiences);
  router.delete("/experiences", isAuthenticated, deleteExperiences);
  router.get("/experience/:id", isAuthenticated, getExperienceByExperienceId);
  router.get("/experiences", isAuthenticated, getExperienceByUserId);
  router.post("/experience", isAuthenticated, addExperience);
  router.put("/experience/:id", isAuthenticated, updateExperience);
  router.delete("/experience/:id", isAuthenticated, deleteExperience);
};
