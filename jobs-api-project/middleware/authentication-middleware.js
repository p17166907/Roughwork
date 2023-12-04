const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors/index-errors')
const { StatusCodes } = require('http-status-codes');

const auth = async (req, res, next) => {

    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthenticatedError('(!authHeader || !authHeader.startsWith(Bearer)) - Authentication invalid')
    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(payload);
        // attach the user to the job routes
        req.user = { userId: payload.userId, name: payload.name }
        next()
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({msg: 'Authentication invalid'})
        // throw new UnauthenticatedError('Authentication invalid')
    }


}

module.exports = auth