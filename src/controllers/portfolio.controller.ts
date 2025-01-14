import { getUserByUsername, publishByUserId } from "../services/user";

export const getPortfolio = async (req: any, res: any) => {
  try {
    const { username } = req.params;
    const User = await getUserByUsername(username);
    if (!User || User.isPublished === false) {
      return res.status(404).json({ error: "Portfolio not found" });
    }
    const portFolio = {
      name: User.name,
      email: User.email,
      role: User.role,
      about: User.about,
      links: User.links,
      resume: User.resumes.find((r: any) => r?.isPrimary === true)?.url,
      image: User.image?.url,
    };
    return res.status(200).json({ status: "ok", data: portFolio });
  } catch (error) {
    console.error("Error Getting PortFolio:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const publishPortfolio = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await publishByUserId(id);

    return res.status(200).json({ message: "Published successfully" });
  } catch (error) {
    console.error("Error Getting PortFolio:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
