const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Location', locationSchema);