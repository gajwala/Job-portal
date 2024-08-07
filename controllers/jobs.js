import Job from "../models/job.js";
import DataURIParser from "datauri/parser.js";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import Application from "../models/application.js";
function getDataUri(file) {
  const parser = new DataURIParser();
  const extName = path.extname(file.originalname).toString();

  return parser.format(extName, file.buffer);
}
export const createJob = async (req, res) => {
  try {
    const {
      title,
      skills,
      companyName,
      contactInfo,
      location,
      experience,
      description,
      salaryRateForHour,
    } = req.body;

    let descriptionUrl = "";

    if (req.file) {
      // Upload file to Cloudinary
      const fileUri = getDataUri(req.file);
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      try {
        const result = await cloudinary.uploader.upload(fileUri.content, {
          resource_type: "auto", // This will handle different types of files
          secure: true,
        });
        descriptionUrl = result.secure_url;
        console.log("descriptionUrl", descriptionUrl);
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }

    const job = new Job({
      description,
      title,
      companyName,
      contactInfo,
      skills: skills.split(","),
      location,
      experience,
      postedBy: req.user._id,
      descriptionFile: descriptionUrl,
      salaryRateForHour,
    });

    await job.save();
    res.status(201).send(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllJobs = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  try {
    const jobs = await Job.find()
      .sort({ _id: -1 }) // Sort by _id in descending order
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select("-applications"); // Exclude applications if not needed

    const total = await Job.countDocuments();

    res.json({
      jobs,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobDetails = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    res.status(200).send(job);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const applyToJob = async (req, res) => {
  const { jobId, userId } = req.body;

  try {
    // Create and save the new application
    const newApplication = new Application({
      jobId,
      userId,
    });

    const savedApplication = await newApplication.save();

    // Update the job with the new application
    await Job.findByIdAndUpdate(
      jobId,
      { $push: { applications: savedApplication._id } },
      { new: true }
    );

    // Fetch the job details
    const jobDetails = await Job.findById(jobId);

    // Return both the application and job details
    res.status(201).json({
      application: savedApplication,
      job: jobDetails,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getJobsPostedByUser = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  try {
    const userId = req.params.userId;

    // Fetch the jobs posted by the user with pagination
    const jobs = await Job.find({ postedBy: userId })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Count the total number of jobs posted by the user
    const total = await Job.countDocuments({ postedBy: userId });

    res.json({
      jobs,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getAppliedJobsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const applications = await Application.find({ userId }).populate("jobId");
    const appliedJobs = applications
      .map((application) => application.jobId)
      .filter((job) => job !== null); // Filter out null values
    res.status(200).json({ appliedJobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  const { jobId } = req.params;

  try {
    // Find the job and get the list of applications
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Delete all associated applications
    await Application.deleteMany({ _id: { $in: job.applications } });

    // Delete the Job document
    await Job.findByIdAndDelete(jobId);

    res.status(200).json({
      message: "Job and associated applications removed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteApplicant = async (req, res) => {
  const { jobId, applicantId } = req.params;

  try {
    // Remove the applicant from the Job's applications array
    await Job.findByIdAndUpdate(
      jobId,
      { $pull: { applications: applicantId } },
      { new: true }
    );

    // Delete the Application document
    await Application.findByIdAndDelete(applicantId);

    res.status(200).json({ message: "Applicant removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
