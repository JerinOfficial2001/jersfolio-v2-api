import { ProjectModel } from "../model/project.model";

export const getAllProjects = () => ProjectModel.find();

export const getProjectsByType = (type: any, id: any) =>
  ProjectModel.find({ projectType: type, user_id: id });

export const getProjectById = (id: string) => ProjectModel.findById(id);

export const getProjectByUserId = (id: string) =>
  ProjectModel.find({ user_id: id });

export const createProject = (values: Record<string, any>) =>
  new ProjectModel(values).save().then((project) => project.toObject());

export const deleteProjectById = (id: string) =>
  ProjectModel.findOneAndDelete({ _id: id }).then((project) =>
    project.toObject()
  );

export const deleteAllProjects = () => ProjectModel.deleteMany();

export const updateProjectById = (id: string, values: Record<string, any>) =>
  ProjectModel.findByIdAndUpdate(id, values);
