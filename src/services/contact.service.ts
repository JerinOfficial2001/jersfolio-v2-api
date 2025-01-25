import { ContactModel } from "../model/contact.model";

export const getAllContacts = () => ContactModel.find();

export const getContactById = (id: string) => ContactModel.findById(id);

export const getContactByUserId = (id: string) =>
  ContactModel.findOne({ user_id: id });

export const createContact = (values: Record<string, any>) =>
  new ContactModel(values).save().then((contact) => contact.toObject());

export const deleteContactById = (id: string) =>
  ContactModel.findOneAndDelete({ _id: id }).then((contact) =>
    contact.toObject()
  );

export const deleteAllContacts = () => ContactModel.deleteMany();

export const updateContactById = (id: string, values: Record<string, any>) =>
  ContactModel.findByIdAndUpdate(id, values);
