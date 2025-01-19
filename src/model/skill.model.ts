import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
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

export const SkillModel = mongoose.model("Skill", SkillSchema);
