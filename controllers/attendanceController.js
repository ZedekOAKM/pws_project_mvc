const Attendance = require('../models/Attendance');
const Event = require('../models/Event');


exports.attendEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.session.user.id; 

        
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).send('Akce nebyla nalezena.');
        }

        const currentAttendeesCount = await Attendance.countDocuments({ event: eventId });

        if (currentAttendeesCount >= event.maxAttendees) {
            return res.status(400).send('Omlouváme se, ale kapacita této akce je již plná.');
        }

        const newAttendance = new Attendance({
            event: eventId,
            user: userId
        });

        await newAttendance.save();
        
       
        res.redirect('/events');
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).send('Na tuto akci už jsi přihlášen/a!');
        }
        console.error(error);
        res.status(500).send('Chyba při přihlašování na akci.');
    }
};

exports.unattendEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.session.user.id;

        await Attendance.findOneAndDelete({ event: eventId, user: userId });

        res.redirect('/events');
    } catch (error) {
        console.error(error);
        res.status(500).send('Chyba při odhlašování z akce.');
    }
};