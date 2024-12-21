import { Request, Response } from "express";
import { authentication, random } from "../helpers";
import { verifyGoogleToken } from "../services/googleAuth";
import { createUser, getUserByEmail } from "../services/user";

export const login = async (req: any, res: any) => {
  try {
    const { email, password, access_token } = req.body;

    if (access_token) {
      const googleData = await verifyGoogleToken(access_token);

      if (!googleData) {
        return res.status(401).json({ error: "Invalid token" });
      }

      let user: any = await getUserByEmail(googleData.email);
      if (!user) {
        user = await createUser({
          email: googleData.email,
          username: googleData.name,
          authType: "google-auth",
          authentication: {},
        });
      }

      if (!user.authentication) {
        user.authentication = {};
      }

      const salt = random();
      user.authentication.access_token = authentication(
        salt,
        user._id.toString()
      );
      await user.save();

      res.cookie("JERSFOLIO-V2-AUTH", user.authentication.access_token, {
        domain: "localhost",
        path: "/",
        httpOnly: false,
        sameSite: "Lax",
        secure: false,
      });

      return res.status(200).json({ message: "Login successful", data: user });
    }

    if (!email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const expectedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password !== expectedHash) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    const salt = random();
    user.authentication.access_token = authentication(
      salt,
      user._id.toString()
    );
    await user.save();
    res.cookie("JERSFOLIO-V2-AUTH", user.authentication.access_token, {
      domain: "localhost",
      path: "/",
    });
    return res.status(200).json({ message: "Login successful", data: user });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const register = async (req: any, res: any) => {
  try {
    const { email, password, username, type } = req.body;

    if (type === "google-auth") {
      const user = await createUser({
        email,
        username,
        authType: "google-auth",
      });
      return login(
        { ...req, body: { email: user.email, password: password } },
        res
      );
    }

    if (!email || !username || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
      authType: "jersfolio-auth",
    });
    return login(
      { ...req, body: { email: user.email, password: password } },
      res
    );
  } catch (error) {
    console.error("Error in register:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = (req: any, res: any) => {
  res.clearCookie("JERSFOLIO-V2-AUTH", {
    domain: "localhost",
    path: "/",
    httpOnly: false,
    sameSite: "Lax",
    secure: false,
  });
  return res.status(200).json({ message: "Logout successful" });
};
