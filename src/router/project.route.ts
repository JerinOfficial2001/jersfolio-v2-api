import express from "express";
import { uploadImage } from "../controllers/auth.controller";
import { upload } from "../configs/cloudinary";
import { isAuthenticated } from "../middlewares";
import {
  addProjects,
  deleteProjects,
  getProjects,
  getProjectsByProjectType,
} from "../controllers/project.controller";

export default (router: express.Router) => {
  const uploadImageOptions = (req: any, res: any, next: any) =>
    upload(req, res, next, { folder: "icon", fileType: "image" });
  const uploadFieldsOptions = (req: any, res: any, next: any) =>
    upload(req, res, next, {
      folder: "projects",
      fields: [{ name: "images" }, { name: "icon", maxCount: 1 }],
    });

  router.get("/project", isAuthenticated, getProjects);
  router.delete("/project", isAuthenticated, deleteProjects);
  router.get("/project/:type", isAuthenticated, getProjectsByProjectType);
  router.post("/project", isAuthenticated, uploadFieldsOptions, addProjects);
  // router.put("/user/:id", isAuthenticated, uploadFieldsOptions, updateUser);
};
