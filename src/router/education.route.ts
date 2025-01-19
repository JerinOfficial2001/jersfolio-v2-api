import express from "express";
import { isAuthenticated } from "../middlewares";
import {
  addEducation,
  deleteEducation,
  deleteEducations,
  getEducationByEducationId,
  getEducationByUserId,
  getEducations,
  updateEducation,
} from "../controllers/education.controller";

export default (router: express.Router) => {
  router.get("/alleducations", isAuthenticated, getEducations);
  router.delete("/educations", isAuthenticated, deleteEducations);
  router.get("/educations", isAuthenticated, getEducationByUserId);
  router.get("/education/:id", isAuthenticated, getEducationByEducationId);
  router.post("/education", isAuthenticated, addEducation);
  router.put("/education/:id", isAuthenticated, updateEducation);
  router.delete("/education/:id", isAuthenticated, deleteEducation);
};
