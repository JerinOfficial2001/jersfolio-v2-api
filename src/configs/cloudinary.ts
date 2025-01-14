import { configDotenv } from "dotenv";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinaryModule from "cloudinary";

configDotenv();

export const cloudinary = cloudinaryModule.v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = (folder: any) =>
  new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req: any, file: any) => {
      let resourceType = "image";
      const fileExtension = file.mimetype.split("/")[0];

      if (fileExtension === "application") {
        resourceType = "raw";
      }

      try {
        return {
          folder:
            "JersfolioV2/" +
            (fileExtension === "application" ? "resumes" : folder),
          allowed_formats: ["jpeg", "jpg", "png", "pdf"],
          resource_type: resourceType,
        };
      } catch (error) {
        console.error("Error in upload:", error);
        throw new Error("Internal server error");
      }
    },
  });
export const upload = (req: any, res: any, next: any, options?: any) => {
  let uploadMiddleware;
  if (!options?.fields) {
    uploadMiddleware = multer({ storage: storage(options?.folder) }).single(
      options?.fileType
    );
  } else {
    uploadMiddleware = multer({ storage: storage(options?.folder) }).fields(
      options?.fields
    );
  }
  uploadMiddleware(req, res, (err: any) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "upload image err : " + err.message });
    }
    next();
  });
};
