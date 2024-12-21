import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
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
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("User", UserSchema);
