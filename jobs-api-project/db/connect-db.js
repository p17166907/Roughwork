const mongoose = require('mongoose');

/**
 * Connects to the MongoDB database.
 * @param {string} url - The MongoDB connection string.
 * @returns A promise that resolves upon a successful database connection.
 */

const connectDB = (url) => {
    // url will be the connection string for the MongoDB instance.
    return mongoose.connect(url, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    }).then(() => { console.log('CONNECTED TO THE DB...'); }).catch((error) => { console.log('error in connectDB',error) })
}

module.exports = connectDB;
