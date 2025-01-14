import { cloudinary, upload } from "../configs/cloudinary";
import { getUserById, updateresumeByUserId } from "./user";

export const uploadImage = (req: any, res: any) => {
  try {
    if (req.file) {
      return {
        url: req.file.path,
        public_id: req.file.filename.replace(/\.\w+$/, ""),
      };
    }
  } catch (error) {
    console.error("Error in upload:", error);
    return res.status(401).json({ message: "Error in upload" });
  }
};

export const deleteImage = async (req: any, res: any) => {
  try {
    const resource_type = req.resource_type
      ? { resource_type: req.resource_type }
      : {};
    const result = await cloudinary.uploader.destroy(req.id, resource_type);

    return result;
  } catch (error) {
    console.log("Image Deletion:", error);
    return res.status(401).json({ error: "Error in Image Deletion" });
  }
};
export const uploadPdf = async (req: any, res: any) => {
  try {
    const user_id = req.params.user_id;
    if (!user_id) {
      return res.status(400).json({
        error: "User Id is required",
      });
    }
    const user = await getUserById(user_id);

    if (!req.file && !req.isNotAllowed) {
      return res.status(400).json({
        error: "Resume is required",
      });
    }
    if (req.file) {
      await updateresumeByUserId(user_id, [
        ...user?.resumes,
        {
          public_id: req.file.filename,
          url: req.file.path,
          isPrimary: false,
          name: req.file.originalname,
        },
      ]);
    }

    if (!req.isNotAllowed) {
      return res.status(200).json({ message: "Resume Uploaded" });
    }
  } catch (error) {
    if (req.file.filename) await deleteImage({ id: req.file.filename }, res);
    console.error("Error in Resume Upload:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
