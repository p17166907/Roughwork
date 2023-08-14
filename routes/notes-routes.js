const express = require('express');
// require routes method from express
const router = require('router');

// Tasks Controller - to handle specific actions for tasks route
const {getAllNotes, createNote} = require('../controllers/notes-controllers')

router.route('/').get(getAllNotes).post(createNote)

//Export file/routes
module.exports = router;