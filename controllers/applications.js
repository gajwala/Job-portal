import  Application  from "../models/application.js";
import Job from "../models/job.js";

export const getApplicationsForJob = async (req, res) => {
    const { jobId } = req.params;

    try {
        const job = await Job.findById(jobId).populate('applications');
        if (!job) return res.status(404).json({ message: 'Job not found' });
        
        res.status(200).json(job.applications);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
 
  };
  