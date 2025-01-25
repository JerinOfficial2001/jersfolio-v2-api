import {
  createContact,
  deleteAllContacts,
  deleteContactById,
  getAllContacts,
  getContactById,
  getContactByUserId,
} from "../services/contact.service";
import { ContactModel } from "../model/contact.model";

export const getContacts = async (req: any, res: any) => {
  try {
    const allContacts = await getAllContacts();
    res.status(200).json(allContacts);
  } catch (error) {
    console.log("Getting Contact failed", error);
    res.status(500).json({ error: "Getting Contact failed" });
  }
};
export const deleteContacts = async (req: any, res: any) => {
  try {
    const allContacts = await deleteAllContacts();
    res.status(200).json(allContacts);
  } catch (error) {
    console.log("Deleting Contact failed", error);
    res.status(500).json({ error: "Deleting Contact failed" });
  }
};
export const addContact = async (req: any, res: any) => {
  try {
    const { phone, address, email } = req.body;
    const missingFields = [];
    if (!phone) missingFields.push("phone");
    if (!address) missingFields.push("address");
    if (!email) missingFields.push("email");

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields: " + missingFields.join(", "),
        fields: missingFields,
      });
    }
    if (!req.user) {
      return res.status(400).json({
        error: "User config failed",
      });
    }
    const result = await createContact({
      phone,
      address,
      email,
      user_id: req.user.id,
    });
    if (!result) {
      return res.status(401).json({
        error: "Creating Contact failed",
      });
    }
    res.status(200).json({ message: "Contact added successfully" });
  } catch (error) {
    console.log("Creating Contact failed", error);
    res.status(500).json({ error: "Creating Contact failed" });
  }
};
export const getContact = async (req: any, res: any) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: "User config failed",
      });
    }
    const contact = await getContactByUserId(req.user.id);
    res.status(200).json(contact);
  } catch (error) {
    console.log("Getting Contact failed", error);
    res.status(500).json({ error: "Getting Contact failed" });
  }
};
export const getContactByContactId = async (req: any, res: any) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ error: "Id is required" });
    }
    const Contact = await getContactById(id);
    res.status(200).json(Contact);
  } catch (error) {
    console.log("Getting Contact failed", error);
    res.status(500).json({ error: "Getting Contact failed" });
  }
};
export const updateContact = async (req: any, res: any) => {
  try {
    const { phone, address, email } = req.body;
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ error: "Id is required" });
    }
    const missingFields = [];
    if (!phone) missingFields.push("phone");
    if (!address) missingFields.push("address");
    if (!email) missingFields.push("email");
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields: " + missingFields.join(", "),
        fields: missingFields,
      });
    }
    const Contact = await ContactModel.findById(id);
    if (!Contact) {
      return res.status(401).json({ error: "Contact not found" });
    }
    Contact.phone = phone;
    Contact.address = address;
    Contact.email = email;
    await Contact.save();
    res.status(200).json({ message: "Contact updated successfully" });
  } catch (error) {
    console.log("updating Contact failed", error);
    res.status(500).json({ error: "Updating Contact failed" });
  }
};
