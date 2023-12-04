//define a class that extends the built in error class
class CustomAPIError extends Error {
    constructor(message) {
        // Call the constructor of the superclass (Error) with the message
        super(message);
    }
}
module.exports = CustomAPIError;