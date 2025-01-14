import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    authentication: {
      password: {
        type: String,
        select: false,
        required: function () {
          return this.authType !== "google-auth";
        },
      },
      salt: { type: String, select: false },
      access_token: { type: String, select: false },
    },
    authType: { type: String, required: true },
    image: { type: mongoose.Schema.Types.Mixed },
    gender: { type: String },
    role: { type: String },
    about: { type: String },
    links: { type: Array },
    resumes: { type: Array },
    isPublished: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("User", UserSchema);
