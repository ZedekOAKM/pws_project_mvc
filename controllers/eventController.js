const Event = require('../models/Event');
const Location = require('../models/Location');

exports.getAddEvent = async (req, res) => {
    try {
        const locations = await Location.find();
        res.render('add-event', { locations });
    } catch (error) {
        res.status(500).send('Chyba při načítání míst.');
    }
};

exports.postAddEvent = async (req, res) => {
    try {
        const { title, description, date, maxAttendees, location } = req.body;

        const newEvent = new Event({
            title,
            description,
            date,
            maxAttendees,
            location,
            organizer: req.session.user.id, 
            image: req.file ? `/uploads/${req.file.filename}` : '/uploads/default-event.png'
        });

        await newEvent.save();
        res.redirect('/events');
    } catch (error) {
        console.error(error);
        res.status(500).send('Chyba při vytváření akce.');
    }
};

exports.getEvents = async (req, res) => {
    try {
        // .populate('location') nám místo ID místa vytáhne rovnou celý objekt místa (název, adresu...)
        const events = await Event.find().populate('location').populate('organizer');
        res.render('events', { events });
    } catch (error) {
        res.status(500).send('Chyba při načítání akcí.');
    }
};