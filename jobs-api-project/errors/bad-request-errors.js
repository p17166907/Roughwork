const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api-errors');

class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
