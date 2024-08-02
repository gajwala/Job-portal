import  Application  from "../models/application.js";

export const getApplicationsForJob = async (req, res) => {
    try {
        const applications = await Application.find({ jobId: req.params.jobId });
        res.status(200).send(applications);
        
    } catch (error) {
        res.status(500).json({
            message:error.message
           }) 
    }
 
  };
  