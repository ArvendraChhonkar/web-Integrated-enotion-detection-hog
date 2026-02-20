const path = require('path');
const express = require('express');
const root_dir = require('../Util/path'); // Importing the root directory path from the util/path.js file
const router = express.Router(); // Create a new router object

const Super_rout = require('./Super_rout'); // Importing the super route from the routes/super.js file

router.get('/', (req, res) => {
    res.render('main', { title: 'Main Page' }); // Render the main.pug template with a title
});

module.exports = router;