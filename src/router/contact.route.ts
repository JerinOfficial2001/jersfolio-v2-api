import express from "express";
import { isAuthenticated } from "../middlewares";
import {
  addContact,
  deleteContacts,
  getContact,
  getContactByContactId,
  getContacts,
  updateContact,
} from "../controllers/contact.controller";

export default (router: express.Router) => {
  router.get("/allcontacts", isAuthenticated, getContacts);
  router.delete("/contacts", isAuthenticated, deleteContacts);
  router.get("/contact/:id", isAuthenticated, getContactByContactId);
  router.get("/contact", isAuthenticated, getContact);
  router.post("/contact", isAuthenticated, addContact);
  router.put("/contact/:id", isAuthenticated, updateContact);
};
