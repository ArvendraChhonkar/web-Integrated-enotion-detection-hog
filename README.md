# The Emotion Engine

So, here is the deal: this app is a handshake between two very different worlds. On one side, you have **Node.js** handling the frantic pace of web requests. On the other, **Python** is sitting back, calculating Histogram of Oriented Gradients (HOG) to figure out if someone is happy or just neutral. It is complex, it is bursty, and it is pretty cool when it actually clicks.

## The Technical Deep-Dive

Underneath the hood, this isn't just a simple file upload; it’s a cross-language relay race.

* **The Backend (Node.js)**: Uses `express` to serve the UI and `multer` as a gatekeeper to stream multipart/form-data into your `uploads/` folder.
* **The Bridge (`child_process`)**: We use `spawn` to create a separate process for Python. This is non-blocking, so your server doesn't freeze while the model is thinking.
* **The Intelligence (Python + SVM)**: The script takes the image path, uses OpenCV to normalize it to 48x48 pixels, and computes HOG features. These features are then fed into a Support Vector Machine (`svm_model.joblib`) which maps them to specific emotion labels.

## Getting It Up and Running

1. **Dependencies**: Run `npm install express multer pug` to get the Node environment ready.
2. **Python Prep**: You cannot extract features without the right tools. Ensure you have the muscle:
`pip install opencv-python joblib numpy`
3. **The Model**: Drop your `svm_model.joblib` and `emotion_labels.json` into the root folder.
4. **Launch**: Hit `node app.js` and point your browser to `http://localhost:3000`.

## The Blueprint

Your folder structure is vital because the child process depends on relative paths to find your script and models:

* **`app.js`**: The heart. It initializes Express and sets up the Pug engine.
* **`routes/`**: Contains `Super_rout.js`, which handles the heavy lifting of `POST /upload`, spawns the Python process, and then executes `fs.unlink` to delete the image once the prediction is done.
* **`predict.py`**: The actual intelligence. It prints the predicted label to `stdout`, which Node then captures.
* **`views/`**: Where `main.pug` (the upload form) and `show.pug` (the results display) live.
* **`util/path.js`**: A helper that ensures we always know where the root directory is, regardless of which subfolder a script is running from.

---
