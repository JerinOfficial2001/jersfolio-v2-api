import express from "express";
import { isAuthenticated } from "../middlewares";
import {
  addSkill,
  deleteSkill,
  deleteSkills,
  getSkillBySkillId,
  getSkillByUserId,
  getSkills,
  updateSkill,
} from "../controllers/skill.controller";

export default (router: express.Router) => {
  router.get("/allskills", isAuthenticated, getSkills);
  router.delete("/skills", isAuthenticated, deleteSkills);
  router.get("/skill/:id", isAuthenticated, getSkillBySkillId);
  router.get("/skills", isAuthenticated, getSkillByUserId);
  router.post("/skill", isAuthenticated, addSkill);
  router.put("/skill/:id", isAuthenticated, updateSkill);
  router.delete("/skill/:id", isAuthenticated, deleteSkill);
};
