import {
  authentication,
  random,
  generateUsername,
  generateJWT,
} from "../helpers";
import { verifyGoogleToken } from "../services/googleAuth";
import {
  createUser,
  getUserByEmail,
  getUserById,
  updateImageByUserId,
} from "../services/user";
import { profile } from "../constants";
import { deleteImage } from "../services/cloudinaryService";

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

      const { token, expiresAt } = generateJWT(user);
      return res
        .status(200)
        .json({ message: "Login successful", token, expiresAt });
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

    const { token, expiresAt } = generateJWT(user);
    return res
      .status(200)
      .json({ message: "Login successful", token, expiresAt });
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
      if (req.file) await deleteImage({ id: req.file.filename }, res);
      return res.status(400).json({
        error: "Missing required fields: " + missingFields.join(", "),
        fields: missingFields,
      });
    }
    const generatedUsername = await generateUsername(email, username, false);
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      if (req.file) await deleteImage({ id: req.file.filename }, res);
      return res
        .status(409)
        .json({ error: "User already exists", field: "email" });
    }
    if (!generatedUsername) {
      if (req.file) await deleteImage({ id: req.file.filename }, res);
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
    uploadImage(
      { ...req, params: { user_id: user._id }, isNotAllowed: true },
      res
    );
    return login(
      { ...req, body: { email: user.email, password: password } },
      res
    );
  } catch (error) {
    if (req.file) await deleteImage({ id: req.file.filename }, res);
    console.error("Error in register:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const uploadImage = async (req: any, res: any) => {
  try {
    const user_id = req.params.user_id;
    if (!user_id) {
      return res.status(400).json({
        error: "User Id is required",
      });
    }
    const user = await getUserById(user_id);
    if (user && user?.image && user?.image?.public_id) {
      const { result } = await deleteImage({ id: user.image.public_id }, res);

      if (result != "ok") {
        return res.status(400).json({
          error: "Image Deletion failed",
        });
      }

      await updateImageByUserId(user_id, {
        public_id: req.file.filename,
        url: req.file.path,
      });
    } else {
      if (!req.file && !req.isNotAllowed) {
        return res.status(400).json({
          error: "Image is required",
        });
      }
      if (req.file) {
        await updateImageByUserId(user_id, {
          public_id: req.file.filename,
          url: req.file.path,
        });
      }
    }
    if (!req.isNotAllowed) {
      return res.status(200).json({ message: "Image Uploaded" });
    }
  } catch (error) {
    console.error("Error in Auth Image Upload:", error);
    if (req.file && req.file.filename)
      await deleteImage({ id: req.file.filename }, res);
    // return res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = (req: any, res: any) => {
  // No need to clear cookies as JWT is stateless
  return res.status(200).json({ message: "Logout successful" });
};
