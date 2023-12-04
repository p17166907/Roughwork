const NoteModelSchema = require('../models/note-models');
const jwt = require('jsonwebtoken');
const { BadRequestError } = require('../errors/bad-request-errors');  // For custom error handling


const getAllNotes = async (req, res) => {
    try {
        const { title, content } = req.query;

        // Mock User Info
        const id = new Date().getDate();
        const username = new Date().getFullYear();

        if (!username || !id) { throw new BadRequestError('Please provide valid user info'); }

        // Generate JWT Token
        const token = jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: '30d' });

        // Prepare Query Object
        const queryObject = {};
        //  api/v1/notes?title=wood
        if (title) { queryObject.title = { $regex: title, $options: 'i' }; }
        //  api/v1/notes?content= some value
        if (content) { queryObject.content = { $regex: content, $options: 'i' }; }

        // Run DB Query
        const notes = await NoteModelSchema.find(queryObject);

        // Send Response
        res.status(200).json({ msg: `Welcome '${username}' you are authorised!`, data: notes, token });
    } catch (error) { res.status(400).json({ msg: 'Error occurred', error: error.message }); }
};

module.exports = { getAllNotes };
