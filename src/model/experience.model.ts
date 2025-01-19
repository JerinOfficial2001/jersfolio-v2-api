import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema(
  {
    company_name: { type: String, required: true },
    place: { type: String, required: true },
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

export const ExperienceModel = mongoose.model("Experience", ExperienceSchema);
