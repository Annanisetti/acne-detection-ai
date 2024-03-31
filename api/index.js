const express = require('express');
const mongoose = require('mongoose');

const User = require('./models/user.model.js');

const app = express();
app.use(express.json())

// Endpoints

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
    console.log('Sum went wrong')
});