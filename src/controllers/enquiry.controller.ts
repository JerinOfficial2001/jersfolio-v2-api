import { sendEnquiryEmail } from "../services/emailService";
import { EnquiryModel } from "../model/enquiry.model";
import {
  createEnquiry,
  deleteAllEnquirys,
  getAllenquirys,
  getEnquiryById,
  getEnquiryByUserId,
} from "../services/enquiry.service";

export const getEnquirys = async (req: any, res: any) => {
  try {
    const allEnquirys = await getAllenquirys();
    res.status(200).json(allEnquirys);
  } catch (error) {
    console.log("Getting Enquiry failed", error);
    res.status(500).json({ error: "Getting Enquiry failed" });
  }
};
export const deleteEnquirys = async (req: any, res: any) => {
  try {
    const allEnquirys = await deleteAllEnquirys();
    res.status(200).json(allEnquirys);
  } catch (error) {
    console.log("Deleting Enquiry failed", error);
    res.status(500).json({ error: "Deleting Enquiry failed" });
  }
};
export const addEnquiry = async (req: any, res: any) => {
  try {
    const {
      phone,
      request,
      email,
      first_name,
      last_name,
      message,
      user_id,
      sendTo,
    } = req.body;
    const missingFields = [];
    if (!phone) missingFields.push("phone");
    if (!request) missingFields.push("request");
    if (!email) missingFields.push("email");
    if (!first_name) missingFields.push("first_name");
    if (!last_name) missingFields.push("last_name");
    if (!message) missingFields.push("message");
    if (!user_id) missingFields.push("user_id");

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields: " + missingFields.join(", "),
        fields: missingFields,
      });
    }
    const result = await createEnquiry({
      phone,
      request,
      email,
      first_name,
      last_name,
      message,
      user_id,
    });
    if (!result) {
      return res.status(401).json({
        error: "Creating Enquiry failed",
      });
    }
    try {
      await sendEnquiryEmail(
        sendTo,
        first_name,
        last_name,
        email,
        phone,
        request,
        message
      );
    } catch (error) {
      console.log("Error sending email:", error);
      return res.status(500).json({ error: "Error sending email" });
    }
    res.status(200).json({ message: "Enquiry sent successfully" });
  } catch (error) {
    console.log("Creating Enquiry failed", error);
    res.status(500).json({ error: "Creating Enquiry failed" });
  }
};
export const getEnquiry = async (req: any, res: any) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: "User config failed",
      });
    }
    const enquiry = await getEnquiryByUserId(req.user.id);
    res.status(200).json(enquiry);
  } catch (error) {
    console.log("Getting Enquiry failed", error);
    res.status(500).json({ error: "Getting Enquiry failed" });
  }
};
export const getEnquiryByEnquiryId = async (req: any, res: any) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ error: "Id is required" });
    }
    const Enquiry = await getEnquiryById(id);
    res.status(200).json(Enquiry);
  } catch (error) {
    console.log("Getting Enquiry failed", error);
    res.status(500).json({ error: "Getting Enquiry failed" });
  }
};
export const updateEnquiry = async (req: any, res: any) => {
  try {
    const { phone, request, email, first_name, last_name, message, user_id } =
      req.body;
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ error: "Id is required" });
    }
    const missingFields = [];
    if (!phone) missingFields.push("phone");
    if (!request) missingFields.push("request");
    if (!email) missingFields.push("email");
    if (!first_name) missingFields.push("first_name");
    if (!last_name) missingFields.push("last_name");
    if (!message) missingFields.push("message");
    if (!user_id) missingFields.push("user_id");
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields: " + missingFields.join(", "),
        fields: missingFields,
      });
    }
    const Enquiry = await EnquiryModel.findById(id);
    if (!Enquiry) {
      return res.status(401).json({ error: "Enquiry not found" });
    }
    Enquiry.phone = phone;
    Enquiry.request = request;
    Enquiry.email = email;
    Enquiry.first_name = first_name;
    Enquiry.last_name = last_name;
    Enquiry.message = message;
    Enquiry.user_id = user_id;
    await Enquiry.save();
    res.status(200).json({ message: "Enquiry updated successfully" });
  } catch (error) {
    console.log("updating Enquiry failed", error);
    res.status(500).json({ error: "Updating Enquiry failed" });
  }
};
