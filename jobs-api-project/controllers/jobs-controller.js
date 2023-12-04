// Import the Job model, which is used to interact with the jobs collection in your MongoDB.
const Job = require('../models/Job-model');

// Import HTTP status codes for more readable status assignments.
const { StatusCodes } = require('http-status-codes');

/**
 * Retrieves all job postings created by the authenticated user.
 * @async
 * @function getAllJobs
 * @param {Object} req - The Express request object, containing user details.
 * @param {Object} res - The Express response object.
 * @returns {void} Returns nothing, but sends an HTTP response with the jobs data.
 */
const getAllJobs = async (req, res) => {
    try {
        // Use the Job model to find all jobs in the database where the 'createdBy' field matches the userId from the request user object.
        // Sort the results by the 'createdAt' field to return them in the order they were created.
        const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt');

        // Log request parameters and user information for debugging or monitoring purposes.
        console.log('Request parameters in getAllJobs function (jobs-controller.js)', req.params);
        console.log('User information in getAllJobs function (jobs-controller.js)', req.user);

        // Send an HTTP response with status code 200 (OK), including the jobs data and the total count of jobs retrieved.
        return res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
    } catch (error) {
        // Handle any errors that occur during the retrieval process.
        console.error('Error in getAllJobs function:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
};

/**
 * Create a job posting by the authenticated user.
 * @async
 * @function createJob
 * @param {Object} req - The Express request object, containing user details.
 * @param {Object} res - The Express response object.
 * @returns {void} Returns nothing, but sends an HTTP response with the job data created.
 */
const createJob = async (req, res) => {
    try {
        // Set the 'createdBy' field in the request body to the userId of the authenticated user.
        req.body.createdBy = req.user.userId;

        // Create a new job record using the Job model and the request body.
        const job = await Job.create(req.body);

        // Send an HTTP response with status code 201 (Created), including the created job data.
        return res.status(StatusCodes.CREATED).json({ job });
    } catch (error) {
        // Handle any errors that occur during the job creation process.
        console.error('Error in createJob function:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
};

/**
 * Get a job posting by ID created by the authenticated user.
 * @async
 * @function getJob
 * @param {Object} req - The Express request object, containing user details and job ID.
 * @param {Object} res - The Express response object.
 * @returns {void} Returns nothing, but sends an HTTP response with the requested job data.
 */
const getJob = async (req, res) => {
    try {
        // Extract userId and jobId from request parameters.
        const { user: { userId }, params: { id: jobId } } = req;

        // Find a job in the database with the specified ID and createdBy field matching the userId.
        const job = await Job.findOne({ _id: jobId, createdBy: userId });

        // If no matching job is found, return a 404 status with an error message.
        if (!job) { return res.status(StatusCodes.NOT_FOUND).json({ msg: `No job with id ${jobId}` }); }

        // Send an HTTP response with status code 200 (OK), including the requested job data.
        res.status(StatusCodes.OK).json({ job });
    } catch (error) {
        // Handle any errors that occur during the job retrieval process.
        console.error('Error in getJob function:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
};
/**
 * Update a job posting by a specific user.
 * 
 * @param {Object} req - The request object containing the job and user details.
 * @param {Object} res - The response object to send back the updated job data or error message.
 * @returns {Promise<Response>} The response object with the status code and updated job data or error message.
 */
const updateJob = async (req, res) => {

    const { body: { company, position }, user: { userId }, params: { id: jobId } } = req

    if (company === '' || position === '') { return res.status(StatusCodes.BAD_REQUEST).json({ msg: `Company or Position fields cannot be empty` }); }

    const job = await Job.findByIdAndUpdate({ _id: jobId, createdBy: userId }, req.body, { new: true, runValidators: true })

    if (!job) { return res.status(StatusCodes.NOT_FOUND).json({ msg: `No job with id ${jobId}` }); }

    console.log('response from updateJob function in jobs-controller.js', job);

    return res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async (req, res) => {

    const { body: { company, position }, user: { userId }, params: { id: jobId } } = req


    const job = await Job.findByIdAndRemove({ _id: jobId, createdBy: userId })

    if (!job) { return res.status(StatusCodes.NOT_FOUND).json({ msg: `No job with id ${jobId}` }); }

    console.log('response from deleteJob function in jobs-controller.js', job);

    return res.status(StatusCodes.OK).send('Job entry has been deleted successfully')
}

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
