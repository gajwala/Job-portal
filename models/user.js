import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    email: { type: String, required: [true, "Email required"] },
    password: { type: String, required: true },
    role: { type: String, enum: ["freelancer", "employer"], required: true },
    skills: [String],
    githubProfile: String,
    projects: [String],
    contactInfo: String,
    name: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
