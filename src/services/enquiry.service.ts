import { EnquiryModel } from "../model/enquiry.model";

export const getAllenquirys = () => EnquiryModel.find();

export const getEnquiryById = (id: string) => EnquiryModel.findById(id);

export const getEnquiryByUserId = (id: string) =>
  EnquiryModel.findOne({ user_id: id });

export const createEnquiry = (values: Record<string, any>) =>
  new EnquiryModel(values).save().then((enquiry) => enquiry.toObject());

export const deleteEnquiryById = (id: string) =>
  EnquiryModel.findOneAndDelete({ _id: id }).then((enquiry) =>
    enquiry.toObject()
  );

export const deleteAllEnquirys = () => EnquiryModel.deleteMany();

export const updateEnquiryById = (id: string, values: Record<string, any>) =>
  EnquiryModel.findByIdAndUpdate(id, values);
