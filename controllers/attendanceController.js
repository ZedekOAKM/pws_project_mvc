const Attendance = require('../models/Attendance');
const Event = require('../models/Event');

exports.attendEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.session.user.id; 

        const event = await Event.findById(eventId);
        if (!event) {
            req.session.notification = { type: 'error', text: 'Akce nebyla nalezena.' };
            return res.redirect('/events');
        }

        const currentAttendeesCount = await Attendance.countDocuments({ event: eventId });

        if (currentAttendeesCount >= event.maxAttendees) {
            req.session.notification = { type: 'error', text: 'Omlouváme se, ale kapacita této akce je již plná. 🛑' };
            return res.redirect('/events');
        }

        const newAttendance = new Attendance({
            event: eventId,
            user: userId
        });

        await newAttendance.save();
        
        
        req.session.notification = { type: 'success', text: 'Úspěšně jsi se přihlásil(a) na akci! 🎉' };
        res.redirect('/events');
    } catch (error) {
        if (error.code === 11000) {
            req.session.notification = { type: 'error', text: 'Na tuto akci už jsi přihlášen/a! 🤔' };
            return res.redirect('/events');
        }
        console.error(error);
        req.session.notification = { type: 'error', text: 'Chyba při přihlašování na akci.' };
        res.redirect('/events');
    }
};

exports.unattendEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.session.user.id;

        await Attendance.findOneAndDelete({ event: eventId, user: userId });

        // Úspěšné odhlášení
        req.session.notification = { type: 'info', text: 'Byl(a) jsi odhlášen(a) z akce.' };
        res.redirect('/events');
    } catch (error) {
        console.error(error);
        req.session.notification = { type: 'error', text: 'Chyba při odhlašování z akce.' };
        res.redirect('/events');
    }
};