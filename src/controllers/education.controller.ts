import {
  createEducation,
  deleteAllEducation,
  deleteEducationById,
  getAllEducation,
  getEducationById,
  getEducationsByUserId,
} from "../services/education.service";
import { EducationModel } from "../model/education.model";

export const getEducations = async (req: any, res: any) => {
  try {
    const allEducations = await getAllEducation();
    res.status(200).json(allEducations);
  } catch (error) {
    console.log("Getting Education failed", error);
    res.status(500).json({ error: "Getting Education failed" });
  }
};
export const deleteEducations = async (req: any, res: any) => {
  try {
    const allEducation = await deleteAllEducation();
    res.status(200).json(allEducation);
  } catch (error) {
    console.log("Deleting Education failed", error);
    res.status(500).json({ error: "Deleting Education failed" });
  }
};
export const addEducation = async (req: any, res: any) => {
  try {
    const { course, institution, year } = req.body;
    const missingFields = [];
    if (!course) missingFields.push("course");
    if (!institution) missingFields.push("institution");
    if (!year) missingFields.push("year");
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
    const result = await createEducation({
      course,
      institution,
      year,
      user_id: req.user.id,
    });
    if (!result) {
      return res.status(401).json({
        error: "Creating Education failed",
      });
    }
    res.status(200).json({ message: "Education added successfully" });
  } catch (error) {
    console.log("Creating Education failed", error);
    res.status(500).json({ error: "Creating Education failed" });
  }
};
export const getEducationByUserId = async (req: any, res: any) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: "User config failed",
      });
    }
    const education = await getEducationsByUserId(req.user.id);
    res.status(200).json(education);
  } catch (error) {
    console.log("Getting Educations failed", error);
    res.status(500).json({ error: "Getting Educations failed" });
  }
};
export const getEducationByEducationId = async (req: any, res: any) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ error: "Id is required" });
    }
    const education = await getEducationById(id);
    res.status(200).json(education);
  } catch (error) {
    console.log("Getting Education failed", error);
    res.status(500).json({ error: "Getting Education failed" });
  }
};
export const updateEducation = async (req: any, res: any) => {
  try {
    const { course, institution, year } = req.body;
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ error: "Id is required" });
    }
    const missingFields = [];
    if (!course) missingFields.push("course");
    if (!institution) missingFields.push("institution");
    if (!year) missingFields.push("year");
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields: " + missingFields.join(", "),
        fields: missingFields,
      });
    }
    const education = await EducationModel.findById(id);
    if (!education) {
      return res.status(401).json({ error: "Education not found" });
    }
    education.course = course;
    education.institution = institution;
    education.year = year;
    await education.save();
    res.status(200).json({ message: "Education updated successfully" });
  } catch (error) {
    console.log("updating Education failed", error);
    res.status(500).json({ error: "Updating Education failed" });
  }
};
export const deleteEducation = async (req: any, res: any) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ error: "Id is required" });
    }
    const education = await EducationModel.findById(id);
    if (!education) {
      return res.status(401).json({ error: "Education not found" });
    }
    const result = deleteEducationById(id);
    if (result) {
      res.status(200).json({
        message: "Education deleted successfully",
      });
    } else {
      res.status(200).json({
        error: "Education deletion failed",
      });
    }
  } catch (error) {
    console.log("Education deletion failed", error);
    res.status(500).json({ error: "Education deletion failed" });
  }
};
