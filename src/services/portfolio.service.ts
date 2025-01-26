import { UserModel } from "../model/users.model";
import { PorfolioModel } from "../model/porfolio.model";

export const getAllPortfolios = () => PorfolioModel.find();

export const getPortFolioByUserId = (id: any) =>
  PorfolioModel.find({ user: id });

export const getPortFolioById = (id: string) => PorfolioModel.findById(id);

export const createPortFolio = (values: Record<string, any>) =>
  new PorfolioModel(values).save().then((portFolio) => portFolio.toObject());

export const deletePortFolioById = (id: string) =>
  PorfolioModel.findOneAndDelete({ _id: id }).then((portFolio) =>
    portFolio.toObject()
  );

export const deleteAllPortFolios = () => PorfolioModel.deleteMany();

export const updatePortFolioById = (id: string, values: Record<string, any>) =>
  PorfolioModel.findByIdAndUpdate(id, values);

export const getPublishedUsers = () => UserModel.find({ isPublished: true });
