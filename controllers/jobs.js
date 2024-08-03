import Job from "../models/job.js";
import Application from "../models/application.js";

export const createJob = async (req, res) => {
  try {
    const {
      description,
      title,
      skills,
      companyName,
      contactInfo,
      location,
      experience,
    } = req.body;
    const job = new Job({
      description,
      title,
      companyName,
      contactInfo,
      skills,
      location,
      experience,

      postedBy: req.user._id,
    });
    await job.save();
    res.status(201).send(job);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    // Exclude the `applications` field
    const jobs = await Job.find().select("-applications");
    res.status(200).send(jobs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
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
  const { jobId, userId, coverLetter } = req.body;

  try {
    const newApplication = new Application({
      jobId,
      userId,
    });

    const savedApplication = await newApplication.save();

    await Job.findByIdAndUpdate(
      jobId,
      { $push: { applications: savedApplication._id } },
      { new: true }
    );

    res.status(201).json(savedApplication);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getJobsPostedByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const jobs = await Job.find({ postedBy: userId });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
