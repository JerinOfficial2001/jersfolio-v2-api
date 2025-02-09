import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    message: { type: String, required: true },
    request: { type: String, required: true },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const EnquiryModel = mongoose.model("Enquiry", EnquirySchema);
