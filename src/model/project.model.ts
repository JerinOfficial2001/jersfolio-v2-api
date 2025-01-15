import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: Array },
    about: { type: String },
    primaryImage: { type: Number },
    link: { type: mongoose.Schema.Types.Mixed },
    icon: { type: Object },
    projectType: { type: String },
    isVisible: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

export const ProjectModel = mongoose.model("Project", ProjectSchema);
