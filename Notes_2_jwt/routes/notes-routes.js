const express = require('express');
const router = express.Router();

// Notes Controller - to handle specific actions for notes route
const { getAllNotes } = require('../controllers/notes-controllers')

const { authenticationMiddleware } = require('../middleware/auth-middleware')

router.route('/').get(authenticationMiddleware, getAllNotes)
//Export file/routes
module.exports = router;