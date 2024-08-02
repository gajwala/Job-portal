import mongoose from "mongoose";

const jobSchema = mongoose.Schema({
  description: { type: String, required: true, maxlength: 16384 },
  requirements: [String],
  tags: [String],
  companyName: { type: String, required: true },
  contactInfo: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }]
});

export default mongoose.model('Job', jobSchema);
