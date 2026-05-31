const Event = require('../models/Event');
const Location = require('../models/Location');
const Attendance = require('../models/Attendance');

// ====== C = CREATE (Zobrazení formuláře pro novou akci) ======
exports.getAddEvent = async (req, res) => {
    try {
        const locations = await Location.find();
        res.render('add-event', { locations });
    } catch (error) {
        console.error(error);
        req.session.notification = { type: 'error', text: 'Chyba při načítání formuláře pro novou akci.' };
        res.redirect('/events');
    }
};

// ====== C = CREATE (Zpracování a uložení nové akce) ======
exports.postAddEvent = async (req, res) => {
    try {
        const { title, description, date, maxAttendees, location } = req.body;
        
        let imagePath = '/uploads/default-poster.jpg';
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }

        const newEvent = new Event({
            title,
            description,
            date,
            maxAttendees,
            location,
            image: imagePath,
            
            organizer: req.session.user.id 
        });

        await newEvent.save();
        
        req.session.notification = { type: 'success', text: 'Nová akce byla úspěšně publikována! 🚀' };
        res.redirect('/events');
    } catch (error) {
        console.error(error);
        req.session.notification = { type: 'error', text: 'Chyba při vytváření akce.' };
        res.redirect('/events');
    }
};

// ====== R = READ  ======
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('location').populate('organizer');
        res.render('events', { events });
    } catch (error) {
        console.error(error);
        req.session.notification = { type: 'error', text: 'Chyba při načítání akcí.' };
        res.redirect('/');
    }
};

// ====== U = UPDATE ======
exports.getEditEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        const locations = await Location.find(); 

        if (!event) {
            req.session.notification = { type: 'error', text: 'Akce nebyla nalezena.' };
            return res.redirect('/events');
        }

        res.render('edit-event', { event, locations });
    } catch (error) {
        console.error(error);
        req.session.notification = { type: 'error', text: 'Chyba při načítání editace akce.' };
        res.redirect('/events');
    }
};

// ====== U = UPDATE ======
exports.postEditEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const { title, description, date, maxAttendees, location } = req.body;

        const event = await Event.findById(eventId);
        if (!event) {
            req.session.notification = { type: 'error', text: 'Akce nebyla nalezena.' };
            return res.redirect('/events');
        }

        
        event.title = title;
        event.description = description;
        event.date = date;
        event.maxAttendees = maxAttendees;
        event.location = location;

        if (req.file) {
            event.image = `/uploads/${req.file.filename}`;
        }

        await event.save();
        
        
        req.session.notification = { type: 'success', text: 'Změny v akci byly úspěšně uloženy. ✏️' };
        res.redirect('/events');
    } catch (error) {
        console.error(error);
        req.session.notification = { type: 'error', text: 'Chyba při ukládání úprav akce.' };
        res.redirect('/events');
    }
};

// ====== D = DELETE  ======
exports.deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;

        await Event.findByIdAndDelete(eventId);
        await Attendance.deleteMany({ event: eventId });

       
        req.session.notification = { type: 'info', text: 'Akce byla úspěšně odstraněna ze systému. 🗑️' };
        res.redirect('/events');
    } catch (error) {
        console.error(error);
        req.session.notification = { type: 'error', text: 'Chyba při mazání akce.' };
        res.redirect('/events');
    }
};