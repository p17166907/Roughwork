// Import the Mongoose library
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // JSON Web Token for authentication


// Define the schema - specifying structure of documents in the collection
const UserSchema = new mongoose.Schema({
    name: {
        type: String, // Corrected to String
        required: [true, 'must provide a name'],
        maxLength: [50, 'name must be less than 50 characters'],
        minLength: [2, 'name must be more than 2 characters']
    },
    email: {
        type: String, // Corrected to String
        required: [true, 'must provide an email'],
        unique: true, // Moved inside email field
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'provide valid email']
    },
    password: {
        type: String, // Corrected to String
        required: [true, 'must provide a password'],
        minLength: [6, 'password must be more than 6 characters']
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

/**
 * Mongoose pre-save middleware.
 * This function gets executed before a document is saved to the database.
 * @param {function} next - Call this function to move to the next middleware.
 */
UserSchema.pre('save', async function (next) {
    // Generate a salt using bcrypt with a factor of 10
    const salt = await bcrypt.genSalt(10);
    // Hash the user's password using the generated salt
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

/**
 * Method to create a JSON Web Token (JWT) for the user.
 * This token is used for authentication and includes payload data such as user ID and name.
 * @method createJWT
 * @memberof UserSchema.methods
 * @returns {string} The generated JWT token.
 */
UserSchema.methods.createJWT = function () {
    // Extract user ID and name from the user schema instance
    const { _id, name } = this;
    // Retrieve JWT secret and lifetime from environment variables
    const { JWT_SECRET, JWT_LIFETIME } = process.env;
    // Create and sign a JWT token using the jwt.sign() method
    // Payload: User ID and name    // Secret: JWT secret from environment variables    // Options: Token expiration time
    const token = jwt.sign({ userId: _id, name }, JWT_SECRET, { expiresIn: JWT_LIFETIME });
    // Return the generated JWT token
    return token;
};

/**
 * Compares a candidate password with the current user's hashed password.
 * @param {string} candidatePassword - The password to compare.
 * @returns {boolean} True if the passwords match, false otherwise.
 * @throws {Error} When password comparison fails.
 */
UserSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        // Use bcrypt to compare the candidate password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        
        return isMatch;
    } catch (error) { throw new Error('Password comparison failed'); }
};



module.exports = mongoose.model('User', UserSchema);
