import express from "express";
import { uploadImage } from "../controllers/auth.controller";
import { upload } from "../configs/cloudinary";
import { isAuthenticated } from "../middlewares";
import {
  deleteAllUser,
  getAllUser,
  getUser,
  updateUser,
} from "../controllers/user.controller";

export default (router: express.Router) => {
  const uploadImageOptions = (req: any, res: any, next: any) =>
    upload(req, res, next, { folder: "auth", fileType: "image" });
  const uploadFieldsOptions = (req: any, res: any, next: any) =>
    upload(req, res, next, {
      folder: "auth",
      fields: [
        { name: "image", maxCount: 1 },
        { name: "pdf", maxCount: 3 },
      ],
    });

  router.get("/users", isAuthenticated, getAllUser);
  router.get("/user", isAuthenticated, getUser);
  router.delete("/users", isAuthenticated, deleteAllUser);
  router.post("/user/upload/:user_id", uploadImageOptions, uploadImage);
  router.put("/user/:id", isAuthenticated, uploadFieldsOptions, updateUser);
};
