const NoteModelSchema = require('../models/note-models');

// Utility function to handle response and error
const handleResponse = (res, statusCode, data) => {
    if (statusCode >= 400) { return res.status(statusCode).json({ error: data }); }
    return res.status(statusCode).json(data);
};

//Retrieve all notes
const getAllNotes = async (req, res, next) => {
    try {
        const { title, content } = req.query
        // Prepare the query object based on the extracted parameters
        const queryObject = {};

        //  api/v1/notes?title=wood
        if (title) { queryObject.title = { $regex: title, $options: 'i' }; }
        //  api/v1/notes?content= some value
        if (content) { queryObject.content = { $regex: content, $options: 'i' }; }

        //Query the db
        let query = NoteModelSchema.find(queryObject);

        //Await the executed query
        const notes = await query;
        console.log(queryObject);
        // console.log(query);

        handleResponse(res, 200, { notes });

    } catch (error) { handleResponse(res, 500, { error }); }
}

//Create a note
const createNote = async (req, res) => {
    try {
        const { body } = req

        //Query the db - to create a note
        let query = NoteModelSchema.create(body);

        //Await the executed query
        const notes = await query;
        console.log(query);

        handleResponse(res, 201, { notes });


    } catch (error) { handleResponse(res, 500, { error }); }
}

module.exports = { getAllNotes, createNote }