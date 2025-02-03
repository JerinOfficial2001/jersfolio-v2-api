import express from "express";
import { uploadImage } from "../controllers/auth.controller";
import { upload } from "../configs/cloudinary";
import { isAuthenticated } from "../middlewares";
import {
  addProjects,
  deleteProject,
  deleteProjects,
  getProjectByProjectId,
  getProjects,
  getProjectsByProjectType,
  updateProject,
  updateVisibility,
} from "../controllers/project.controller";

export default (router: express.Router) => {
  const uploadImageOptions = (req: any, res: any, next: any) =>
    upload(req, res, next, { folder: "icon", fileType: "image" });
  const uploadFieldsOptions = (req: any, res: any, next: any) =>
    upload(req, res, next, {
      folder: "projects",
      fields: [{ name: "images" }, { name: "icon", maxCount: 1 }],
    });

  router.get("/projects", isAuthenticated, getProjects);
  router.get("/projects/:type", isAuthenticated, getProjectsByProjectType);
  router.get("/project/:id", getProjectByProjectId);
  router.delete("/project", isAuthenticated, deleteProjects);
  router.post("/project", isAuthenticated, uploadFieldsOptions, addProjects);
  router.put(
    "/project/:id",
    isAuthenticated,
    uploadFieldsOptions,
    updateProject
  );
  router.put("/project/visibility/:id", isAuthenticated, updateVisibility);
  router.delete("/project/:id", isAuthenticated, deleteProject);
};
