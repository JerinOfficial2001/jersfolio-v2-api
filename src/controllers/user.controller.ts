import { UserModel } from "../model/users.model";
import { generateUsername, getUserIdByToken } from "../helpers";
import {
  deleteAllUsers,
  getUserByEmail,
  getUserById,
  getUsers,
  updateUserById,
} from "../services/user";
import { uploadImage } from "./auth.controller";
import { deleteImage, uploadPdf } from "../services/cloudinaryService";

export const getAllUser = async (req: any, res: any) => {
  try {
    const users = await getUsers();

    return res.status(200).json({ data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const getUser = async (req: any, res: any) => {
  try {
    const accessToken = req.headers.authorization?.replace("Bearer ", "");
    const userID = await getUserIdByToken(accessToken);
    if (!userID) return res.status(401).json({ error: "Unauthorized" });
    const user = await getUserById(userID);
    return res.status(200).json({ data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const deleteAllUser = async (req: any, res: any) => {
  try {
    const users = await deleteAllUsers();

    return res.status(200).json({ data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const updateUser = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const User = await UserModel.findById(id);

    if (!User) {
      const { pdf, image } = req.files;
      if (pdf) {
        pdf.forEach(async (file: any) => {
          if (file.filename) await deleteImage({ id: file.filename }, res);
        });
      }
      if (image) {
        image.forEach(async (file: any) => {
          if (file.filename) await deleteImage({ id: file.filename }, res);
        });
      }
      return res.status(404).json({ error: "User not found" });
    }
    const {
      email,
      username,
      name,
      gender,
      role,
      about,
      image,
      links,
      resumeIds,
    } = req.body;
    const missingFields = [];
    if (!email) missingFields.push("email");
    if (!username) missingFields.push("username");
    if (!name) missingFields.push("name");

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields: " + missingFields.join(", "),
        fields: missingFields,
      });
    }
    const existingUser = await getUserByEmail(email);
    let generatedUsername = username;
    if (existingUser && username != existingUser?.username) {
      generatedUsername = await generateUsername(email, username, false);
    }

    if (existingUser && existingUser?._id != id) {
      return res
        .status(409)
        .json({ error: "Email already exists", field: "email" });
    }
    if (!generatedUsername) {
      return res
        .status(409)
        .json({ error: username + " already exists", field: "username" });
    }
    if (req.files) {
      const { pdf, image } = req.files;
      if (pdf) {
        pdf.forEach(async (file: any) => {
          uploadPdf(
            { ...req, file: file, params: { user_id: id }, isNotAllowed: true },
            res
          );
        });
      }
      if (image) {
        uploadImage(
          {
            ...req,
            file: image[0],
            params: { user_id: id },
            isNotAllowed: true,
          },
          res
        );
      }
    }

    if (User) {
      User.email = email;
      User.username = generatedUsername;
      User.name = name;
      User.about = about;
      User.gender = gender;
      User.role = role;
      User.links = links;

      if (resumeIds) {
        for (let resume of resumeIds) {
          await deleteImage({ id: resume, resource_type: "raw" }, res);
        }
        User.resumes = User.resumes.filter(
          (resume: any) => !resumeIds.includes(resume.public_id)
        );
      }
      if (
        User.image &&
        typeof User.image == "object" &&
        typeof image != "object" &&
        User?.image?.public_id
      ) {
        await deleteImage({ id: User?.image?.public_id }, res);
      }
      if (!req?.files?.image && image) {
        User.image = image;
      }

      await User.save();
    }

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    if (req.files) {
      const { pdf, image } = req.files;
      if (pdf) {
        pdf.forEach(async (file: any) => {
          if (file.filename) await deleteImage({ id: file.filename }, res);
        });
      }
      if (image) {
        image.forEach(async (file: any) => {
          if (file.filename) await deleteImage({ id: file.filename }, res);
        });
      }
    }

    console.error("Error Updating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
