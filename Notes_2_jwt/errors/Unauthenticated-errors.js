const CustomAPIError = require('./custom-errors')
const { StatusCodes } = require('http-status-codes')

class UnauthenticatedError extends CustomAPIError {

    // Constructor method that takes in a message
    constructor(message) {
        // Call the constructor of the superclass (Error) with the message
        super(message);
        // Attach an additional property statusCode to the error object
        this.statusCode = StatusCodes.UNAUTHORIZED;;
    }
}

module.exports = {UnauthenticatedError};
