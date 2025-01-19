import { ExperienceModel } from "../model/experience.model";
import {
  createExperience,
  deleteAllExperience,
  deleteExperienceById,
  getAllExperience,
  getExperienceById,
  getExperiencesByUserId,
} from "../services/experience.service";

export const getExperiences = async (req: any, res: any) => {
  try {
    const allExperiences = await getAllExperience();
    res.status(200).json(allExperiences);
  } catch (error) {
    console.log("Getting Experience failed", error);
    res.status(500).json({ error: "Getting Experience failed" });
  }
};
export const deleteExperiences = async (req: any, res: any) => {
  try {
    const allExperience = await deleteAllExperience();
    res.status(200).json(allExperience);
  } catch (error) {
    console.log("Deleting Experience failed", error);
    res.status(500).json({ error: "Deleting Experience failed" });
  }
};
export const addExperience = async (req: any, res: any) => {
  try {
    const { place, company_name, year } = req.body;
    const missingFields = [];
    if (!place) missingFields.push("place");
    if (!company_name) missingFields.push("company_name");
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
    const result = await createExperience({
      place,
      company_name,
      year,
      user_id: req.user.id,
    });
    if (!result) {
      return res.status(401).json({
        error: "Creating Experience failed",
      });
    }
    res.status(200).json({ message: "Experience added successfully" });
  } catch (error) {
    console.log("Creating Experience failed", error);
    res.status(500).json({ error: "Creating Experience failed" });
  }
};
export const getExperienceByUserId = async (req: any, res: any) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: "User config failed",
      });
    }
    const educations = await getExperiencesByUserId(req.user.id);
    res.status(200).json(educations);
  } catch (error) {
    console.log("Getting Experiences failed", error);
    res.status(500).json({ error: "Getting Experiences failed" });
  }
};
export const getExperienceByExperienceId = async (req: any, res: any) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ error: "Id is required" });
    }
    const education = await getExperienceById(id);
    res.status(200).json(education);
  } catch (error) {
    console.log("Getting Experience failed", error);
    res.status(500).json({ error: "Getting Experience failed" });
  }
};
export const updateExperience = async (req: any, res: any) => {
  try {
    const { place, company_name, year } = req.body;
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ error: "Id is required" });
    }
    const missingFields = [];
    if (!place) missingFields.push("place");
    if (!company_name) missingFields.push("company_name");
    if (!year) missingFields.push("year");
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields: " + missingFields.join(", "),
        fields: missingFields,
      });
    }
    const education = await ExperienceModel.findById(id);
    if (!education) {
      return res.status(401).json({ error: "Experience not found" });
    }
    education.place = place;
    education.company_name = company_name;
    education.year = year;
    await education.save();
    res.status(200).json({ message: "Experience updated successfully" });
  } catch (error) {
    console.log("updating Experience failed", error);
    res.status(500).json({ error: "Updating Experience failed" });
  }
};
export const deleteExperience = async (req: any, res: any) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ error: "Id is required" });
    }
    const education = await ExperienceModel.findById(id);
    if (!education) {
      return res.status(401).json({ error: "Experience not found" });
    }
    const result = deleteExperienceById(id);
    if (result) {
      res.status(200).json({
        message: "Experience deleted successfully",
      });
    } else {
      res.status(200).json({
        error: "Experience deletion failed",
      });
    }
  } catch (error) {
    console.log("Experience deletion failed", error);
    res.status(500).json({ error: "Experience deletion failed" });
  }
};
