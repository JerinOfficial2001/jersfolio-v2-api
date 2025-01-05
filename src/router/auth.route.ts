import express from "express";

import {
  login,
  logout,
  register,
  uploadImage,
} from "../controllers/auth.controller";
import { upload } from "../configs/cloudinary";

export default (router: express.Router) => {
  const uploadOptions = (req: any, res: any, next: any) =>
    upload(req, res, next, { folder: "auth", fileType: "image" });

  router.post("/auth/register", uploadOptions, register);
  router.post("/auth/upload/:user_id", uploadOptions, uploadImage);
  router.post("/auth/login", login);
  router.post("/auth/logout", logout);
};
