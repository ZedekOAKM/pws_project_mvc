const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    image: {
        type: String, 
        default: '/uploads/default-event.png'
    },
    maxAttendees: {
        type: Number,
        required: true
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false 
    }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);