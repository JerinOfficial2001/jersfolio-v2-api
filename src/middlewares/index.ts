import { get, identity, merge } from "lodash";
import { getUserByAccessToken } from "../services/user";

export const isOwner = async (req: any, res: any, next: any) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;

    if (!currentUserId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No access token provided" });
    }

    if (currentUserId !== id) {
      return res
        .status(403)
        .json({ message: "Forbidden: You are not the owner" });
    }

    next();
  } catch (error) {
    console.error("Error in isOwner middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const isAuthenticated = async (req: any, res: any, next: any) => {
  try {
    const accessToken = req.cookies["JERSFOLIO-V2-AUTH"];
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No access token provided" });
    }

    const existingUser = await getUserByAccessToken(accessToken);
    if (!existingUser) {
      return res.status(404).json({ message: "User does not exist" });
    }

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
