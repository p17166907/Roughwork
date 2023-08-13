const NoteModelSchema = require('../models/note-models');

// Utility function to handle response and error
const handleResponse = (res, statusCode, data) => {
    if (statusCode >= 400) { return res.status(statusCode).json({ error: data }); }
    return res.status(statusCode).json(data);
};

//Retrieve all notes
const getAllNotes = async (req, res, next) => {
    try {
        // Prepare the query object based on the extracted parameters
        const queryObject = {};
        
        //Query the db
        let query = NoteModelSchema.find(queryObject);
        
        //Await the executed query
        const notes = await query;
        console.log(queryObject);
        console.log(query);

        handleResponse(res, 200, { notes });

    } catch (error) { handleResponse(res, 500, { error }); }
}