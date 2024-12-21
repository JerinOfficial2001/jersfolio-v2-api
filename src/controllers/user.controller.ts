import { getUsers } from "../services/user";

export const getAllUser = async (req: any, res: any) => {
  try {
    const users = await getUsers();

    return res.status(200).json({ data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
