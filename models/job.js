import mongoose from "mongoose";

const jobSchema = mongoose.Schema(
  {
    description: { type: String, required: true, maxlength: 16384 },
    title: String,
    companyName: { type: String, required: true },
    contactInfo: { type: String, required: true },
    experience: String,
    location: String,
    skills: [String],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applications: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
