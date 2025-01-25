import { ProjectModel } from "../model/project.model";
import { deleteMultipleDocs, validateWordCount } from "../helpers";
import { deleteImage, uploadImage } from "../services/cloudinaryService";
import {
  createProject,
  deleteAllProjects,
  deleteProjectById,
  getAllProjects,
  getProjectById,
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
    const {
      isVisible,
      title,
      about,
      description,
      primaryImage,
      projectType,
      link,
    } = req.body;
    const missingFields = [];
    if (!req.user) {
      deleteReqImages(req, res);
      return res.status(400).json({
        error: "User config failed",
      });
    }
    if (!title) missingFields.push("title");
    if (!about) missingFields.push("about");
    if (!description) missingFields.push("description");
    if (!link) missingFields.push("link");
    if (missingFields.length > 0) {
      deleteReqImages(req, res);
      return res.status(400).json({
        error: "Missing required fields: " + missingFields.join(", "),
        fields: missingFields,
      });
    }
    console.log(validateWordCount(about));

    if (!validateWordCount(about)) {
      deleteReqImages(req, res);
      return res
        .status(401)
        .json({ error: "Must have atleast 80 words", field: "about" });
    }
    const result = await createProject({
      title,
      about,
      description,
      primaryImage,
      projectType,
      link,
      isVisible,
      user_id: req.user.id,
    });
    if (!result) {
      deleteReqImages(req, res);
      return res.status(401).json({ error: "Project creation failed" });
    }
    if (req.files) {
      const { images, icon } = req.files;
      const project = await ProjectModel.findById(result._id);

      if (icon) {
        const logo = uploadImage(
          {
            ...req,
            file: icon[0],
            params: { user_id: result._id },
            isNotAllowed: true,
          },
          res
        );
        if (logo) {
          project.icon = logo;
        }
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
        project.images = imageArr;
      }
      await project.save();
    }
    res.status(200).json({ message: "Project added successfully" });
  } catch (error) {
    deleteReqImages(req, res);
    console.log("Creating project failed", error);
    res.status(500).json({ error: "Creating project failed" });
  }
};
export const getProjectsByProjectType = async (req: any, res: any) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: "User config failed",
      });
    }
    const type = req.params.type;
    if (!type) {
      return res.status(401).json({ error: "Type required" });
    }
    const projects = await getProjectsByType(type, req.user.id);
    res.status(200).json(projects);
  } catch (error) {
    console.log("Get projects By Type failed", error);
    res.status(500).json({ error: "Get projects By Type failed" });
  }
};
export const getProjectByProjectId = async (req: any, res: any) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ error: "Id is required" });
    }
    const project = await getProjectById(id);
    res.status(200).json(project);
  } catch (error) {
    console.log("Getting projects failed", error);
    res.status(500).json({ error: "Getting projects failed" });
  }
};
export const updateProject = async (req: any, res: any) => {
  try {
    const {
      isVisible,
      title,
      about,
      description,
      primaryImage,
      projectType,
      link,
      imageIds,
    } = req.body;
    const id = req.params.id;
    if (!id) {
      deleteReqImages(req, res);
      return res.status(401).json({ error: "Id is required" });
    }
    if (!req.user) {
      deleteReqImages(req, res);
      return res.status(400).json({
        error: "User config failed",
      });
    }
    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!about) missingFields.push("about");
    if (!description) missingFields.push("description");
    if (!link) missingFields.push("link");
    if (missingFields.length > 0) {
      deleteReqImages(req, res);
      return res.status(400).json({
        error: "Missing required fields: " + missingFields.join(", "),
        fields: missingFields,
      });
    }
    if (!validateWordCount(about)) {
      deleteReqImages(req, res);
      return res
        .status(401)
        .json({ error: "Must have atleast 70 words", field: "about" });
    }
    const project = await ProjectModel.findById(id);
    if (!project) {
      deleteReqImages(req, res);
      return res.status(401).json({ error: "Project not found" });
    }
    if (req.files) {
      const { images, icon } = req.files;

      if (icon) {
        if (project?.icon && project?.icon?.public_id) {
          await deleteImage({ id: project.icon.public_id }, res);
        }
        const logo = uploadImage(
          {
            ...req,
            file: icon[0],
            params: { user_id: id },
            isNotAllowed: true,
          },
          res
        );
        if (logo) {
          project.icon = logo;
        }
      }
      if (images) {
        let imageArr: any = project.images;
        images.forEach((image: any) => {
          const img = uploadImage(
            {
              ...req,
              file: image,
              params: { user_id: id },
              isNotAllowed: true,
            },
            res
          );
          if (img) {
            imageArr.push(img);
          }
        });
        project.images = imageArr;
      }
    }

    if (imageIds) {
      for (let image of imageIds) {
        await deleteImage({ id: image }, res);
      }
      project.images = project.images.filter(
        (image: any) => !imageIds.includes(image.public_id)
      );
    }
    project.isVisible = isVisible;
    project.title = title;
    project.about = about;
    project.description = description;
    project.primaryImage = primaryImage;
    project.projectType = projectType;
    project.link = link;
    project.user_id = req.user.id;

    await project.save();
    res.status(200).json({ message: "Project updated successfully" });
  } catch (error) {
    deleteReqImages(req, res);
    console.log("updating project failed", error);
    res.status(500).json({ error: "Updating project failed" });
  }
};
export const updateVisibility = async (req: any, res: any) => {
  try {
    const { isVisible } = req.body;
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ error: "Id is required" });
    }
    const project = await ProjectModel.findById(id);
    if (!project) {
      return res.status(401).json({ error: "Project not found" });
    }

    project.isVisible = isVisible;

    await project.save();
    res.status(200).json({
      message: `Project will be ${
        isVisible ? "visible to" : "hidden from"
      } everyone`,
    });
  } catch (error) {
    console.log("update project visibility failed", error);
    res.status(500).json({ error: "Updating project visibility failed" });
  }
};
export const deleteProject = async (req: any, res: any) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ error: "Id is required" });
    }
    const project = await ProjectModel.findById(id);
    if (!project) {
      return res.status(401).json({ error: "Project not found" });
    }
    const publicIds: any = [];
    if (project.images && project.images.length > 0) {
      project.images.forEach(async (elem: any) => {
        publicIds.push(elem.public_id);
      });
    }
    if (project?.icon && project?.icon?.public_id) {
      publicIds.push(project.icon.public_id);
    }
    const result = deleteProjectById(id);
    if (result) {
      publicIds.forEach(async (id: any) => {
        await deleteImage({ id: id }, res);
      });
      res.status(200).json({
        message: "Project deleted successfully",
      });
    } else {
      res.status(200).json({
        error: "Project deletion failed",
      });
    }
  } catch (error) {
    console.log("Delete project failed", error);
    res.status(500).json({ error: "Delete project failed" });
  }
};
const deleteReqImages = (req: any, res: any) => {
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
};
