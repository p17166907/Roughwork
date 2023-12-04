// Import User model for database operations
const User = require('../models/User-model');

// Import HTTP status codes
const { StatusCodes } = require('http-status-codes');
// console.log({ StatusCodes });

// Import custom error classes for bad requests and unauthenticated requests
const { BadRequestError, UnauthenticatedError } = require('../errors/index-errors')

/**
 * Create a new user and return user data with a JWT token. (POST)
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON object containing user data and JWT token.
 * @throws {BadRequestError} When user creation fails.
 */
async function register(req, res, next) {
  // Create a new user in the database
  const user = await User.create({ ...req.body });
  // console.log(user);
  let { _id, name, email, createdAt, updatedAt, __v } = user;
  // Generate a JWT token for the new user
  const token = await user.createJWT();
  // Respond with the newly created user and a status code
  res.status(StatusCodes.CREATED).json({ user: { _id, name, email, createdAt, updatedAt, __v }, token });

}

/**
 * Authenticate a user and return user data with a JWT token.
 * This function handles the POST request to the login endpoint.
 * It checks for the presence of an email and password in the request body,
 * validates the user's credentials, and if successful, issues a JWT token.
 *
 * @async
 * @function login
 * @param {Object} req - Express request object containing user credentials.
 * @param {Object} res - Express response object to send back the authentication result.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
const login = async (req, res) => {
  try {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // If either email or password is missing, return a BAD_REQUEST response
    if (!email || !password) { return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Please provide email and password' }); }

    // Look for the user in the database by email
    const user = await User.findOne({ email });
    // If the user is not found, return an UNAUTHORIZED response
    if (!user) { return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Invalid Credentials' }); }

    // Check if the provided password matches the stored password
    const isPasswordCorrect = await user.comparePassword(password);
    // If the password is incorrect, return an UNAUTHORIZED response
    if (!isPasswordCorrect) { return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Invalid Credentials' }); }

    // Generate a JWT for the authenticated user
    const token = user.createJWT();

    // Return the user's name and email along with the JWT token in the response
    return res.status(StatusCodes.OK).json({ user: { name: user.name, email: user.email }, token });

  } catch (error) {
    // If an exception occurs, log the error and return a 500 Internal Server Error response
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Something went wrong' });
  }
};


// Export the register and login functions to use them in other modules
module.exports = { register, login };


