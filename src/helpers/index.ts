import crypto from "crypto";
import { getUserByUsername } from "../services/user";
import jwt from "jsonwebtoken";

const SECRET = "JERSFOLIO_V2.0@JERIN_25_01";

export const random = () => crypto.randomBytes(128).toString("base64");

export const generateJWT = (user: any) => {
  const expiresIn = "24h";
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn,
    }
  );
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
