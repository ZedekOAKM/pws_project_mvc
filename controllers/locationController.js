const Location = require('../models/Location');
const Event = require('../models/Event');
const Attendance = require('../models/Attendance');


// Zobrazení formuláře pro přidání nového místa
exports.getAddLocation = (req, res) => {
    try {
        res.render('add-location'); // vykreslí soubor views/add-location.ejs
    } catch (error) {
        console.error(error);
        req.session.notification = { type: 'error', text: 'Chyba při načítání formuláře.' };
        res.redirect('/locations');
    }
};

// ====== R = READ (Zobrazení všech míst konání) ======
exports.getLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.render('locations', { locations });
    } catch (error) {
        console.error(error);
        req.session.notification = { type: 'error', text: 'Chyba při načítání míst konání.' };
        res.redirect('/');
    }
};

// ====== C = CREATE (Uložení nového místa konání) ======
exports.postAddLocation = async (req, res) => {
    try {
        const { name, address, city, capacity } = req.body;

        const newLocation = new Location({
            name,
            address,
            city,
            capacity
        });

        await newLocation.save();

        // Úspěšné přidání místa
        req.session.notification = { type: 'success', text: 'Nové místo konání bylo úspěšně přidáno! 📍' };
        res.redirect('/locations');
    } catch (error) {
        console.error(error);
        req.session.notification = { type: 'error', text: 'Chyba při vytváření místa konání.' };
        res.redirect('/locations');
    }
};

// ====== U = UPDATE (Zobrazení editačního formuláře) ======
exports.getEditLocation = async (req, res) => {
    try {
        const locationId = req.params.id;
        const location = await Location.findById(locationId);

        if (!location) {
            req.session.notification = { type: 'error', text: 'Místo konání nebylo nalezeno.' };
            return res.redirect('/locations');
        }

        res.render('edit-location', { location });
    } catch (error) {
        console.error(error);
        req.session.notification = { type: 'error', text: 'Chyba při načítání editace místa.' };
        res.redirect('/locations');
    }
};

// ====== U = UPDATE (Uložení upravených dat místa) ======
exports.postEditLocation = async (req, res) => {
    try {
        const locationId = req.params.id;
        const { name, address, city, capacity } = req.body;

        await Location.findByIdAndUpdate(locationId, {
            name,
            address,
            city,
            capacity
        });

        // Úspěšná editace místa
        req.session.notification = { type: 'success', text: 'Změny místa konání byly úspěšně uloženy. ✏️' };
        res.redirect('/locations');
    } catch (error) {
        console.error(error);
        req.session.notification = { type: 'error', text: 'Chyba při ukládání úprav místa.' };
        res.redirect('/locations');
    }
};

// ====== D = DELETE (Mazání místa + kaskádové mazání akcí) ======
exports.deleteLocation = async (req, res) => {
    try {
        const locationId = req.params.id;

       
        const linkedEvents = await Event.find({ location: locationId });
        const eventIds = linkedEvents.map(event => event._id);

      
        await Attendance.deleteMany({ event: { $in: eventIds } });

        await Event.deleteMany({ location: locationId });

        await Location.findByIdAndDelete(locationId);

        req.session.notification = { type: 'info', text: 'Místo včetně všech navázaných akcí a přihlášek bylo smazáno. 🗑️' };
        res.redirect('/locations');
    } catch (error) {
        console.error(error);
        req.session.notification = { type: 'error', text: 'Chyba při mazání místa konání.' };
        res.redirect('/locations');
    }
};