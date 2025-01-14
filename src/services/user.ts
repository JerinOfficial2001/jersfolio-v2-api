import { ObjectId } from "mongoose";
import { UserModel } from "../model/users.model";

export const getUsers = () => UserModel.find();

export const getUserByEmail = (email: string) => UserModel.findOne({ email });

export const getUserByUsername = (username: string) =>
  UserModel.findOne({ username });

export const getUserByAccessToken = (access_token: string) =>
  UserModel.findOne({ "authentication.access_token": access_token });

export const getUserById = (id: any) =>
  UserModel.findById(id).then((user) => user?.toObject());

export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());

export const deleteUserById = (id: string) =>
  UserModel.findOneAndDelete({ _id: id });

export const deleteAllUsers = () => UserModel.deleteMany();

export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);

export const updateImageByUserId = async (
  id: ObjectId | string,
  values: Record<string, any>
) => {
  const User: any = await UserModel.findById(id);
  if (User) {
    User.image = values;
    await User.save();
  }
};
export const updateresumeByUserId = async (
  id: ObjectId | string,
  values: Record<string, any>
) => {
  const User: any = await UserModel.findById(id);
  if (User) {
    User.resumes = values;
    await User.save();
  }
};
export const publishByUserId = async (id: ObjectId | string) => {
  const User: any = await UserModel.findById(id);
  if (User) {
    User.isPublished = true;
    await User.save();
  }
};
