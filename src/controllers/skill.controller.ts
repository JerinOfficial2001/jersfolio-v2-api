import {
  createSkill,
  deleteAllSkills,
  deleteSkillById,
  getAllSkills,
  getSkillById,
  getSkillsByUserId,
} from "../services/skill.service";
import { SkillModel } from "../model/skill.model";

export const getSkills = async (req: any, res: any) => {
  try {
    const allSkills = await getAllSkills();
    res.status(200).json(allSkills);
  } catch (error) {
    console.log("Getting Skill failed", error);
    res.status(500).json({ error: "Getting Skill failed" });
  }
};
export const deleteSkills = async (req: any, res: any) => {
  try {
    const allSkill = await deleteAllSkills();
    res.status(200).json(allSkill);
  } catch (error) {
    console.log("Deleting Skill failed", error);
    res.status(500).json({ error: "Deleting Skill failed" });
  }
};
export const addSkill = async (req: any, res: any) => {
  try {
    const { key } = req.body;
    const missingFields = [];
    if (!key) missingFields.push("key");

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
    const result = await createSkill({
      key,
      user_id: req.user.id,
    });
    if (!result) {
      return res.status(401).json({
        error: "Creating Skill failed",
      });
    }
    res.status(200).json({ message: "Skill added successfully" });
  } catch (error) {
    console.log("Creating Skill failed", error);
    res.status(500).json({ error: "Creating Skill failed" });
  }
};
export const getSkillByUserId = async (req: any, res: any) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: "User config failed",
      });
    }
    const education = await getSkillsByUserId(req.user.id);
    res.status(200).json(education);
  } catch (error) {
    console.log("Getting Skills failed", error);
    res.status(500).json({ error: "Getting Skills failed" });
  }
};
export const getSkillBySkillId = async (req: any, res: any) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ error: "Id is required" });
    }
    const Skill = await getSkillById(id);
    res.status(200).json(Skill);
  } catch (error) {
    console.log("Getting Skill failed", error);
    res.status(500).json({ error: "Getting Skill failed" });
  }
};
export const updateSkill = async (req: any, res: any) => {
  try {
    const { key } = req.body;
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ error: "Id is required" });
    }
    const missingFields = [];
    if (!key) missingFields.push("key");
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields: " + missingFields.join(", "),
        fields: missingFields,
      });
    }
    const Skill = await SkillModel.findById(id);
    if (!Skill) {
      return res.status(401).json({ error: "Skill not found" });
    }
    Skill.key = key;
    await Skill.save();
    res.status(200).json({ message: "Skill updated successfully" });
  } catch (error) {
    console.log("updating Skill failed", error);
    res.status(500).json({ error: "Updating Skill failed" });
  }
};
export const deleteSkill = async (req: any, res: any) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ error: "Id is required" });
    }
    const Skill = await SkillModel.findById(id);
    if (!Skill) {
      return res.status(401).json({ error: "Skill not found" });
    }
    const result = deleteSkillById(id);
    if (result) {
      res.status(200).json({
        message: "Skill deleted successfully",
      });
    } else {
      res.status(200).json({
        error: "Skill deletion failed",
      });
    }
  } catch (error) {
    console.log("Skill deletion failed", error);
    res.status(500).json({ error: "Skill deletion failed" });
  }
};
