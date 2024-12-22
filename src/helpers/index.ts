import crypto from "crypto";
import { getUserByUsername } from "../services/user";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv();
const SECRET = process.env.SECRET;

export const random = () => crypto.randomBytes(128).toString("base64");

export const generateJWT = (user: any) => {
  const expiresIn = "24h";
  const token = jwt.sign({ id: user._id, email: user.email }, SECRET, {
    expiresIn,
  });
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  return { token, expiresAt };
};

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
