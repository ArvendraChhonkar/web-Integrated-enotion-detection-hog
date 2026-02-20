import sys
import cv2
import joblib
import numpy as np 

# Mapping of class indices to labels
emotion_labels = {
    0: 'Angry', 1: 'Disgust', 2: 'Fear', 3: 'Happy', 
    4: 'Sad', 5: 'Surprise', 6: 'Neutral'
}

# HOG Descriptor initialization (parameters must match training exactly)
hog = cv2.HOGDescriptor(_winSize=(48, 48),
                        _blockSize=(16, 16),
                        _blockStride=(8, 8),
                        _cellSize=(8, 8),
                        _nbins=9)

def extract_hog_features(img):
    """Computes HOG features for a single 48x48 image."""
    # Ensure the data is uint8 (required by OpenCV's HOGDescriptor)
    if img.dtype != np.uint8:
        img = (img * 255).astype('uint8') if img.max() <= 1.0 else img.astype('uint8')
            
    hog_feature = hog.compute(img)
    # Reshape to (1, -1) so it's ready for the classifier/PCA
    return hog_feature.flatten().reshape(1, -1)

def predict_img(image_path):
    try:
        # 1. Load the model(s)
        clf = joblib.load("svm_model.joblib")
        # UNCOMMENT the line below if you used PCA during training!
        # pca = joblib.load("pca_model.joblib")

        # 2. Read and Preprocess
        img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        if img is None:
            sys.stderr.write(f"Error: Unable to read image at {image_path}\n")
            return

        img = cv2.resize(img, (48, 48))

        # 3. Feature Extraction
        features = extract_hog_features(img)

        # 4. Dimensionality Reduction (Only if PCA was used in training)
        # features = pca.transform(features)

        # 5. Prediction
        prediction = clf.predict(features)
        
        # Step 4 Requirement: Print ONLY the prediction label to stdout
        print(emotion_labels[prediction[0]])

    except Exception as e:
        sys.stderr.write(f"Error: {e}\n")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("USE: python predict.py <image_path>")
    else:
        predict_img(sys.argv[1])