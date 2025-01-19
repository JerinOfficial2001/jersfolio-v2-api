import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const EducationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true },
    course: { type: String, required: true },
    year: { type: Array },
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

export const EducationModel = mongoose.model("Education", EducationSchema);
