import { SkillModel } from "../model/skill.model";

export const getAllSkills = () => SkillModel.find();

export const getSkillById = (id: string) => SkillModel.findById(id);

export const getSkillsByUserId = (id: string) =>
  SkillModel.find({ user_id: id });

export const createSkill = (values: Record<string, any>) =>
  new SkillModel(values).save().then((project) => project.toObject());

export const deleteSkillById = (id: string) =>
  SkillModel.findOneAndDelete({ _id: id }).then((project) =>
    project.toObject()
  );

export const deleteAllSkills = () => SkillModel.deleteMany();

export const updateSkillById = (id: string, values: Record<string, any>) =>
  SkillModel.findByIdAndUpdate(id, values);
