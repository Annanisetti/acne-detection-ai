const mongoose = require('mongoose');
const { Schema } = mongoose;
const { model } = mongoose;

const UserSchema = Schema(
    {
        username: String, 
        password: String,
        images: [String], 
        products: [String], 
    }, 
    {
        timestamps: true, 
    }, 
);

const User = model('User', UserSchema);

module.exports = User;