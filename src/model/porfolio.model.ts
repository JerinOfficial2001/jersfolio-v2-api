import mongoose from "mongoose";

const PorfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      required: true,
    },
    works: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    about: {
      experience: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Experience",
        },
      ],
      education: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Education",
        },
      ],
    },
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
    isPrimary: { type: Boolean },
    message: { type: String },
  },
  {
    timestamps: true,
  }
);

export const PorfolioModel = mongoose.model("Porfolio", PorfolioSchema);
