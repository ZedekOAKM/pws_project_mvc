// IMPORTY MODELŮ - Klíčové pro to, aby funkce věděly, s čím pracují!
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
        res.status(500).send('Chyba při načítání formuláře.');
    }
};

// ====== C = CREATE (Zpracování a uložení nové akce) ======
exports.postAddEvent = async (req, res) => {
    try {
        const { title, description, date, maxAttendees, location } = req.body;
        
        let imagePath = '/uploads/default-poster.jpg'; // Výchozí plakát, pokud žádný nenahrají
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
            organizer: req.user._id // Nastavíme přihlášeného uživatele jako organizátora
        });

        await newEvent.save();
        res.redirect('/events');
    } catch (error) {
        console.error(error);
        res.status(500).send('Chyba při vytváření akce.');
    }
};

// ====== R = READ (Zobrazení seznamu akcí) ======
exports.getEvents = async (req, res) => {
    try {
        // Pomocí populate vytáhneme rovnou data o lokaci a organizátorovi
        const events = await Event.find().populate('location').populate('organizer');
        res.render('events', { events });
    } catch (error) {
        console.error(error);
        res.status(500).send('Chyba při načítání akcí.');
    }
};

// ====== U = UPDATE (Zobrazení editačního formuláře) ======
exports.getEditEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        const locations = await Location.find(); 

        if (!event) {
            return res.status(404).send('Akce nebyla nalezena.');
        }

        res.render('edit-event', { event, locations });
    } catch (error) {
        console.error(error);
        res.status(500).send('Chyba při načítání editace akce.');
    }
};

// ====== U = UPDATE (Uložení upravených dat) ======
exports.postEditEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const { title, description, date, maxAttendees, location } = req.body;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).send('Akce nebyla nalezena.');
        }

        // Aktualizujeme data v objektu
        event.title = title;
        event.description = description;
        event.date = date;
        event.maxAttendees = maxAttendees;
        event.location = location;

        if (req.file) {
            event.image = `/uploads/${req.file.filename}`;
        }

        await event.save();
        res.redirect('/events');
    } catch (error) {
        console.error(error);
        res.status(500).send('Chyba při ukládání úprav akce.');
    }
};

// ====== D = DELETE (Mazání akce) ======
exports.deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;

        
        await Event.findByIdAndDelete(eventId);

        await Attendance.deleteMany({ event: eventId });

        res.redirect('/events');
    } catch (error) {
        console.error(error);
        res.status(500).send('Chyba při mazání akce.');
    }
};