const express = require('express');
const mongoose = require('mongoose');
const tf = require('@tensorflow/tfjs');
const { loadGraphModel } = require('@tensorflow/tfjs-converter');
const { createCanvas, loadImage } = require('canvas');

const User = require('./models/user.model.js');

const app = express();
app.use(express.json())

async function preprocessImage(imageData) {
    const canvas = createCanvas();
    const ctx = canvas.getContext('2d');
    const img = new loadImage(`data:image/jpeg;base64,${imageData}`)
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const resizedImage = tf.image.resizeBilinear(tf.browser.fromPixels(canvas), [224, 224]);
    const normalizedImage = resizedImage.toFloat().div(tf.scalar(224));
    const preprocessedImage = normalizedImage.expandDims();

    return preprocessedImage;
}

// Endpoints

app.post('/api/acne-detection', async (req, res) => {
    const model = await loadGraphModel('./model.json');

    const imageData = req.body['image'];
    const preprocessedImage = await preprocessImage(imageData);

    const predictions = model.predict(preprocessedImage);
    res.status(200).json(predictions);
});

app.get('/', (req, res) => {
    res.send('root');
});

app.post('/users/create', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(200).json(user);
    } catch (error) {
        // console.log(error);
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

mongoose.connect('mongodb+srv://anjannanisetti:WKpTBQCipHDiw6at@cluster0.rxggovj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
    console.log('Connected to db');
})
.catch(() => {
    console.log('Sum went wrong');
});

// http://localhost:3000/api/acne-detection