const express = require('express');
const multer = require('multer'); // Multer is a middleware for handling multipart/form-data, which is primarily used for uploading files.
const child = require('child_process'); // Child process module allows you to spawn child processes in a manner that is similar, but more powerful than popen().
const bodyParser = require('body-parser'); // Body-parser is a middleware that parses incoming request bodies in a middleware before your handlers, available under the req.body property.
const path = require('path');
const root_dir = require('./Util/path'); // Importing the root directory path from the util/path.js file
const fs = require('fs');


const app = express();
app.set('view engine', 'pug'); // Set Pug as the view engine for rendering HTML templates

//create upload folder
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}


//routs 
const Default_rout = require('./routes/default'); // Importing the default route from the routes/default.js file
const Super_rout = require('./routes/Super_rout'); // Importing the super route from the routes/super.js file

app.use(bodyParser.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(express.static(path.join(root_dir, 'styles'))); // Serve static files from the 'public' directory

app.use(Super_rout); // Use the super route
app.use(Default_rout); // Use the default route "/"  --> display main.pug

//404 Not Found
app.use((req, res, next) => {
    res.status(404).render('404', { title: '404 Not Found' }); // Render the 404.pug template with a title
});


app.listen(3000); // Start the server on port 3000