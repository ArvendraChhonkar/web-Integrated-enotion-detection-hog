const express = require('express');
const fs = require('fs');
const router = express.Router(); // Create a new router object
const multer = require('multer'); // Importing the multer middleware for handling file uploads
const { spawn } = require('child_process');
const path = require('path');
const root_dir = require('../util/path'); // Importing the root directory path from the util/Util/path'); // This points to your app.js location

// 1. configure multer to store uploaded files in the upload  folder 
const storage  =  multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename : (req, file, cb) => {
        cb(null, Date.now() + file.originalname);

    }
});

const upload = multer({storage : storage}); // Create an instance of multer with the defined storage configuration


router.get('/show', (req, res) => {
    //emotion from the query strimng 
    const emotion = req.query.emotion; // Get the emotion parameter from the query string
    res.render('show', { title: 'Show Page' , emotion: emotion }); // Render the show.pug template with a title and emotion data
});


router.post('/upload', upload.single('image'), (req, res) => {
    if(!req.file) return res.status(400).send('No file uploaded.');

    // 1. Ensure this path points to where the image actually is on disk
    const imagePath = path.join(root_dir, 'uploads', req.file.filename); 
    
    // 2. Point to the python script in the root directory
    const scriptPath = path.join(root_dir, 'predict.py');

    // 3. Use 'python3' if on Linux/Mac, or 'python' on Windows
    const pythonProcess = spawn('python', [scriptPath, imagePath]);

    let prediction = "";
    let errorData = "";

    pythonProcess.stdout.on('data', (data) => {
        prediction += data.toString().trim();
    });

    // CRITICAL: Capture stderr to see WHY it's failing
    pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
    });

    pythonProcess.on('close', (code) => {
        // --- DELETE THE IMAGE START ---
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error(`Error deleting file: ${imagePath}`, err);
            } else {
                console.log(`Successfully deleted: ${imagePath}`);
            }
        });
        // --- DELETE THE IMAGE END ---

        if (code !== 0) {
            return res.status(500).send('Error processing the image.');
        }
        
        res.render('show', { title: 'Show Page', emotion: prediction });
    });
});

module.exports = router; // Export the router to be used in app.js