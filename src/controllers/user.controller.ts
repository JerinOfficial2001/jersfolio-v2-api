import {
  deleteMultipleDocs,
  generateUsername,
  getUserIdByToken,
} from "../helpers";
import { ContactModel } from "../model/contact.model";
import { EducationModel } from "../model/education.model";
import { EnquiryModel } from "../model/enquiry.model";
import { ExperienceModel } from "../model/experience.model";
import { PorfolioModel } from "../model/porfolio.model";
import { ProjectModel } from "../model/project.model";
import { SkillModel } from "../model/skill.model";
import { UserModel } from "../model/users.model";
import { deleteImage, uploadPdf } from "../services/cloudinaryService";
import {
  deleteAllUsers,
  getUserByEmail,
  getUserById,
  getUsers,
} from "../services/user";
import { uploadImage } from "./auth.controller";

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
        deleteMultipleDocs(pdf, res);
      }
      if (image) {
        deleteMultipleDocs(image, res);
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
      if (!req?.files?.image && typeof image == "string" && image?.length < 3) {
        User.image = image;
      }

      await User.save();
    }

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    if (req.files) {
      const { pdf, image } = req.files;
      if (pdf) {
        deleteMultipleDocs(pdf, res);
      }
      if (image) {
        deleteMultipleDocs(image, res);
      }
    }

    console.error("Error Updating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const deleteAccount = async (req: any, res: any) => {
  try {
    const accessToken = req.headers.authorization?.replace("Bearer ", "");
    const userID = await getUserIdByToken(accessToken);
    if (!userID) return res.status(401).json({ error: "Unauthorized" });

    const user = await UserModel.findById(userID);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Delete user's image from Cloudinary if exists
    if (user.image?.public_id) {
      await deleteImage({ id: user.image.public_id }, res);
    }

    // Delete all resume PDFs from Cloudinary
    if (user.resumes && user.resumes.length > 0) {
      for (const resume of user.resumes) {
        await deleteImage({ id: resume.public_id, resource_type: "raw" }, res);
      }
    }

    // Get and delete all projects' images first
    const projects = await ProjectModel.find({ user: userID });
    for (const project of projects) {
      const images = project.images;
      for (let image of images) {
        if (image?.public_id) {
          await deleteImage({ id: image.public_id }, res);
        }
      }
    }

    // Delete all related data
    await Promise.all([
      ContactModel.deleteMany({ user_id: userID }),
      EducationModel.deleteMany({ user_id: userID }),
      ExperienceModel.deleteMany({ user_id: userID }),
      EnquiryModel.deleteMany({ user_id: userID }),
      ProjectModel.deleteMany({ user_id: userID }),
      SkillModel.deleteMany({ user_id: userID }),
      PorfolioModel.deleteMany({ user: userID }),
    ]);

    // Finally delete the user
    await user.deleteOne();

    return res
      .status(200)
      .json({ message: "Account and all related data deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
