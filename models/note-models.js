// Import the Mongoose library
const mongoose = require('mongoose')

// Define the schema - specifying structure of documents in the collection
const NoteSchema = new Schema({
    title: { type: 'string', required: [true, 'must provide a title'], trim: true, maxlenght: [20, 'title must be less than 20 characters'] },
    content: { type: 'string', required: [true, 'must provide a title'], trim: true, },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

})
// Export the Mongoose model for the 'notes' collection, based on the defined TaskSchema.
// This allows other parts of the application to interact with the 'note' collection using this model.
module.exports = mongoose.model('note', NoteSchema)