import { ExperienceModel } from "../model/experience.model";

export const getAllExperience = () => ExperienceModel.find();

export const getExperienceById = (id: string) => ExperienceModel.findById(id);

export const getExperiencesByUserId = (id: string) =>
  ExperienceModel.find({ user_id: id });

export const createExperience = (values: Record<string, any>) =>
  new ExperienceModel(values).save().then((project) => project.toObject());

export const deleteExperienceById = (id: string) =>
  ExperienceModel.findOneAndDelete({ _id: id }).then((project) =>
    project.toObject()
  );

export const deleteAllExperience = () => ExperienceModel.deleteMany();

export const updateExperienceById = (id: string, values: Record<string, any>) =>
  ExperienceModel.findByIdAndUpdate(id, values);
