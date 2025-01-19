import { EducationModel } from "../model/education.model";

export const getAllEducation = () => EducationModel.find();

export const getEducationByType = (type: any) =>
  EducationModel.find({ projectType: type });

export const getEducationById = (id: string) => EducationModel.findById(id);

export const getEducationsByUserId = (id: string) =>
  EducationModel.find({ user_id: id });

export const createEducation = (values: Record<string, any>) =>
  new EducationModel(values).save().then((project) => project.toObject());

export const deleteEducationById = (id: string) =>
  EducationModel.findOneAndDelete({ _id: id }).then((project) =>
    project.toObject()
  );

export const deleteAllEducation = () => EducationModel.deleteMany();

export const updateEducationById = (id: string, values: Record<string, any>) =>
  EducationModel.findByIdAndUpdate(id, values);
