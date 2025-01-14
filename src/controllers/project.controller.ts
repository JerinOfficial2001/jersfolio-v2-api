import { deleteMultipleDocs } from "../helpers";
import { deleteImage, uploadImage } from "../services/cloudinaryService";
import {
  createProject,
  deleteAllProjects,
  getAllProjects,
  getProjectsByType,
} from "../services/project.service";

export const getProjects = async (req: any, res: any) => {
  try {
    const allProjects = await getAllProjects();
    res.status(200).json(allProjects);
  } catch (error) {
    console.log("Getting projects failed", error);
    res.status(500).json({ error: "Getting projects failed" });
  }
};
export const deleteProjects = async (req: any, res: any) => {
  try {
    const allProjects = await deleteAllProjects();
    res.status(200).json(allProjects);
  } catch (error) {
    console.log("Deleting projects failed", error);
    res.status(500).json({ error: "Deleting projects failed" });
  }
};
export const addProjects = async (req: any, res: any) => {
  try {
    const { title, about, description, primaryImage, projectType, link, icon } =
      req.body;
    const result = await createProject({
      title,
      about,
      description,
      primaryImage,
      projectType,
      link,
    });
    if (!result) {
      if (req.files) {
        const { images, apk, icon } = req.files;
        if (images) {
          deleteMultipleDocs(images, res);
        }
        if (apk) {
          deleteMultipleDocs(apk, res);
        }
        if (icon) {
          deleteMultipleDocs(icon, res);
        }
      }
      return res.status(401).json({ error: "Project creation failed" });
    }
    if (req.files) {
      const { images, icon } = req.files;
      if (icon) {
        uploadImage(
          {
            ...req,
            file: icon[0],
            params: { user_id: result._id },
            isNotAllowed: true,
          },
          res
        );
      }
      if (images) {
        let imageArr: any = [];
        images.forEach((image: any) => {
          const img = uploadImage(
            {
              ...req,
              file: image,
              params: { user_id: result._id },
              isNotAllowed: true,
            },
            res
          );
          if (img) {
            imageArr.push(img);
          }
        });
        result.images = imageArr;
      }
      //
    }
    res.status(200).json(result);
  } catch (error) {
    if (req.files) {
      const { images, apk, icon } = req.files;
      if (images) {
        deleteMultipleDocs(images, res);
      }
      if (apk) {
        deleteMultipleDocs(apk, res);
      }
      if (icon) {
        deleteMultipleDocs(icon, res);
      }
    }
    console.log("Creating project failed", error);
    res.status(500).json({ error: "Creating project failed" });
  }
};
export const getProjectsByProjectType = async (req: any, res: any) => {
  try {
    const type = req.params.type;
    if (!type) {
      return res.status(401).json({ error: "Type required" });
    }
    const projects = await getProjectsByType(type);
    res.status(200).json(projects);
  } catch (error) {
    console.log("Get projects By Type failed", error);
    res.status(500).json({ error: "Get projects By Type failed" });
  }
};
