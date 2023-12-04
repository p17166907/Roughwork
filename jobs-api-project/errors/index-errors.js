//this file acts a central hub where all other files in the erros folder can be accessed
const CustomAPIError = require('./custom-api-errors')
const UnauthenticatedError = require('./unauthenticated-errors')
const NotFoundError = require('./not-found-errors')
const BadRequestError = require('./bad-request-errors')

module.exports = {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
}
