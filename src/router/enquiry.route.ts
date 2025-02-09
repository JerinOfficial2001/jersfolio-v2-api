import express from "express";
import { isAuthenticated } from "../middlewares";
import {
  addEnquiry,
  deleteEnquirys,
  getEnquiry,
  getEnquiryByEnquiryId,
  getEnquirys,
  updateEnquiry,
} from "../controllers/enquiry.controller";

export default (router: express.Router) => {
  router.get("/allenquirys", isAuthenticated, getEnquirys);
  router.delete("/enquirys", isAuthenticated, deleteEnquirys);
  router.get("/enquiry/:id", isAuthenticated, getEnquiryByEnquiryId);
  router.get("/enquiry", isAuthenticated, getEnquiry);
  router.post("/enquiry", addEnquiry);
  router.put("/enquiry/:id", isAuthenticated, updateEnquiry);
};
