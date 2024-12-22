import { Request, Response } from "express";
import { authentication, random, generateUsername } from "../helpers";
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
        const generatedUsername = await generateUsername(
          googleData.email,
          googleData.name,
          true
        );

        user = await createUser({
          email: googleData.email,
          name: googleData.name,
          authType: "google-auth",
          authentication: {},
          username: generatedUsername,
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
        domain:
          process.env.NODE_ENV === "production"
            ? "jers-folio-pro.vercel.app"
            : "localhost",
        path: "/",
        httpOnly: false,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
      });

      return res.status(200).json({ message: "Login successful", data: user });
    }

    const missingFields = [];
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields: " + missingFields.join(", "),
        fields: missingFields,
      });
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found", field: "email" });
    }

    const expectedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password !== expectedHash) {
      return res
        .status(401)
        .json({ error: "Incorrect password", field: "password" });
    }
    const salt = random();
    user.authentication.access_token = authentication(
      salt,
      user._id.toString()
    );
    await user.save();
    res.cookie("JERSFOLIO-V2-AUTH", user.authentication.access_token, {
      domain:
        process.env.NODE_ENV === "production"
          ? "jers-folio-pro.vercel.app"
          : "localhost",
      path: "/",
      httpOnly: false,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ message: "Login successful", data: user });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const register = async (req: any, res: any) => {
  try {
    const { email, password, username, name } = req.body;

    const missingFields = [];
    if (!email) missingFields.push("email");
    if (!username) missingFields.push("username");
    if (!password) missingFields.push("password");
    if (!name) missingFields.push("name");

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields: " + missingFields.join(", "),
        fields: missingFields,
      });
    }

    const generatedUsername = await generateUsername(email, username, false);
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User already exists", field: "email" });
    }
    if (!generatedUsername) {
      return res
        .status(409)
        .json({ error: username + " already exists", field: "username" });
    }
    const salt = random();
    const user = await createUser({
      email,
      username: generatedUsername,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
      authType: "jersfolio-auth",
      name,
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
    domain:
      process.env.NODE_ENV === "production"
        ? "jers-folio-pro.vercel.app"
        : "localhost",
    path: "/",
    httpOnly: false,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(200).json({ message: "Logout successful" });
};
