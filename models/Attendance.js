const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });


attendanceSchema.index({ event: 1, user: 1 }, { unique: true }); // uzivatel se na akci nemuze prihlasit 2x

module.exports = mongoose.model('Attendance', attendanceSchema);