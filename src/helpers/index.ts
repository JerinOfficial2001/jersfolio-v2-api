import crypto from "crypto";
import { getUserByUsername } from "../services/user";

const SECRET = "JERSFOLIO_V2.0@JERIN_25_01";

export const random = () => crypto.randomBytes(128).toString("base64");

export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");
};

export const generateUsername = async (
  email: string,
  name: string,
  isGoogleAuth: boolean
) => {
  let username;
  if (isGoogleAuth) {
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    username = `${name.replace(/\s+/g, "").toLowerCase()}${randomSuffix}`;
  } else {
    const existingUser = await getUserByUsername(name);
    if (existingUser) {
      return false;
    } else {
      username = name;
    }
    // username = email.split("@")[0];
  }

  return username;
};
