import Job from "../models/job.js";
import Application from "../models/application.js";

export const createJob = async (req, res) => {
  try {
    const { description, requirements, tags, companyName, contactInfo } =
      req.body;
    const job = new Job({
      description,
      requirements,
      tags,
      companyName,
      contactInfo,
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
    const jobs = await Job.find();
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
    console.log("job found for specific id");
    res.status(200).send(job);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const applyToJob = async (req, res) => {
  try {
    const application = new Application({
      jobId: req.params.jobId,
      userId: req.user._id,
    });
    await application.save();
    res.status(201).send(application);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

