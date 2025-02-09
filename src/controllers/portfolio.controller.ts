import { getProjectByUserId } from "../services/project.service";
import {
  createPortFolio,
  deleteAllPortFolios,
  getAllPortfolios,
  getPortFolioByUserId,
  getPublishedUsers,
} from "../services/portfolio.service";
import {
  getUserById,
  getUserByUsername,
  publishByUserId,
} from "../services/user";
import { getEducationsByUserId } from "../services/education.service";
import { getExperiencesByUserId } from "../services/experience.service";
import { getSkillsByUserId } from "../services/skill.service";
import { PorfolioModel } from "../model/porfolio.model";
import { getContactByUserId } from "../services/contact.service";

export const getPortfolios = async (req: any, res: any) => {
  try {
    const allFolios = await getAllPortfolios();
    return res.status(200).json({ status: "ok", data: allFolios });
  } catch (error) {
    console.error("Error Getting PortFolios:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const deleteAllPortfolios = async (req: any, res: any) => {
  try {
    const allFolios = await deleteAllPortFolios();
    return res.status(200).json({ status: "ok", data: allFolios });
  } catch (error) {
    console.error("Error Getting PortFolios:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const getActivePortfolios = async (req: any, res: any) => {
  try {
    const allFolios = await getPublishedUsers();

    return res.status(200).json(
      await allFolios.map((elem: any) => {
        return {
          name: elem.name,
          email: elem.email,
          username: elem.username,
          id: elem._id,
          image: elem.image,
          gender: elem.gender,
          role: elem.role,
        };
      })
    );
  } catch (error) {
    console.error("Error Getting PortFolios:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const getPortfoliosWithUserID = async (req: any, res: any) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        status: "error",
        error: "User config failed",
      });
    }
    const newFolio = await isPortfolioAlreadyExist(req, res);
    const allFolios = await getPortFolioByUserId(req.user.id);

    const portFolios = {
      new: newFolio
        ? {
            ...newFolio,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            day: new Date().toLocaleString("en-US", { weekday: "short" }),
            isNew: true,
          }
        : false,
      existing: allFolios
        .map((elem) => {
          const obj = elem.toObject();
          const dateObj = new Date(obj.createdAt);
          return {
            ...obj,
            date: dateObj.toLocaleDateString(),
            time: dateObj.toLocaleTimeString(),
            day: dateObj.toLocaleString("en-US", { weekday: "short" }),
            isNew: false,
          };
        })
        .reverse(),
    };

    return res.status(200).json(portFolios);
  } catch (error) {
    console.error("Error Getting PortFolios:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const getPortfolio = async (req: any, res: any) => {
  try {
    const { username } = req.params;
    const User = await getUserByUsername(username);

    if (!User || User.isPublished === false) {
      return res.status(404).json({ error: "Portfolio not found" });
    }
    const portfolios = await getPortFolioByUserId(User._id);
    if (portfolios.length == 0) {
      return res.status(404).json({ error: "Portfolio not found" });
    }
    const activePortfolio = portfolios.find((elem: any) => elem.isPrimary);
    if (!activePortfolio) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    const portfolio = await PorfolioModel.findById(activePortfolio._id)
      .populate("user")
      .populate("works")
      .populate("about.experience")
      .populate("about.education")
      .populate("skills")
      .populate("contact")
      .exec();
    return res.status(200).json({
      ...portfolio.toObject(),
      works: {
        websites: portfolio.works.filter(
          (elem: any) => elem?.projectType == "website"
        ),
        applications: portfolio.works.filter(
          (elem: any) => elem?.projectType == "application"
        ),
      },
    });
  } catch (error) {
    console.error("Error Getting PortFolio:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const publishPortfolio = async (req: any, res: any) => {
  try {
    const { message } = req.body;
    if (!req.user) {
      return res.status(400).json({
        status: "error",
        error: "User config failed",
      });
    }
    const id = req.user.id;
    const newFolio = await isPortfolioAlreadyExist(req, res);
    if (!newFolio) {
      return res.status(400).json({
        status: "error",
        error: "Portfolio already exists",
      });
    }
    const porfolios = await PorfolioModel.find({ isPrimary: true, user: id });
    if (porfolios.length > 0) {
      porfolios.forEach(async (elem: any) => {
        const portFolio = await PorfolioModel.findById(elem._id);
        portFolio.isPrimary = false;
        portFolio.save();
      });
    }
    await createPortFolio({ ...newFolio, message });
    await publishByUserId(id);

    return res.status(200).json({ message: "Published successfully" });
  } catch (error) {
    console.error("Error Publishing PortFolio:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const isPortfolioAlreadyExist = async (req: any, res: any) => {
  const id = req.user.id;
  const allPortFolio = await getAllPortfolios();
  const user: any = await getUserById(id);
  const contact: any = await getContactByUserId(id);
  const projects = await getProjectByUserId(id);
  const education = await getEducationsByUserId(id);
  const experience = await getExperiencesByUserId(id);
  const skills = await getSkillsByUserId(id);
  const newFolio: any = {
    user: user._id,
    contact: contact._id,
    works: projects
      .filter((elem) => elem.isVisible == true)
      .map((elem) => elem._id),
    about: {
      experience: experience.map((elem) => elem._id),
      education: education.map((elem) => elem._id),
    },
    skills: skills.map((elem) => elem._id),
    isPrimary: true,
  };

  if (!newFolio.user_id && !user) {
    return res.status(400).json({
      status: "error",
      error: "User not found",
    });
  }
  const existingPortfolio = allPortFolio
    .filter((elem) => elem.isPrimary == true)
    .find(
      (folio) =>
        folio.user.toString() === newFolio.user.toString() &&
        JSON.stringify(folio.works.map((elem: any) => elem.toString())) ===
          JSON.stringify(newFolio.works.map((elem: any) => elem.toString())) &&
        JSON.stringify(
          folio.about.experience.map((elem: any) => elem.toString())
        ) ===
          JSON.stringify(
            newFolio.about.experience.map((elem: any) => elem.toString())
          ) &&
        JSON.stringify(
          folio.about.education.map((elem: any) => elem.toString())
        ) ===
          JSON.stringify(
            newFolio.about.education.map((elem: any) => elem.toString())
          ) &&
        JSON.stringify(folio.skills.map((elem: any) => elem.toString())) ===
          JSON.stringify(newFolio.skills.map((elem: any) => elem.toString()))
    );
  if (existingPortfolio) {
    return false;
  }
  return newFolio;
};
