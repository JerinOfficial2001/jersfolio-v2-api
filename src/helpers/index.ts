import crypto from "crypto";

const SECRET = "JERSFOLIO_V2.0@JERIN_25_01";

export const random = () => crypto.randomBytes(128).toString("base64");

export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");
};