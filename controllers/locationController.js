const Location = require('../models/Location');
const Event = require('../models/Event');
const Attendance = require('../models/Attendance');

// ====== R = READ (Zobrazení všech míst konání) ======
exports.getLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.render('locations', { locations });
    } catch (error) {
        console.error(error);
        res.status(500).send('Chyba při načítání míst konání.');
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
        res.redirect('/locations');
    } catch (error) {
        console.error(error);
        res.status(500).send('Chyba při vytváření místa konání.');
    }
};

// ====== U = UPDATE (Zobrazení editačního formuláře) ======
exports.getEditLocation = async (req, res) => {
    try {
        const locationId = req.params.id;
        const location = await Location.findById(locationId);

        if (!location) {
            return res.status(404).send('Místo konání nebylo nalezeno.');
        }

        res.render('edit-location', { location });
    } catch (error) {
        console.error(error);
        res.status(500).send('Chyba při načítání editace místa.');
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

        res.redirect('/locations');
    } catch (error) {
        console.error(error);
        res.status(500).send('Chyba při ukládání úprav místa.');
    }
};

// ====== D = DELETE (Mazání místa + kaskádové mazání akcí) ======
exports.deleteLocation = async (req, res) => {
    try {
        const locationId = req.params.id;

        // 1. Najdeme akce navázané na toto místo
        const linkedEvents = await Event.find({ location: locationId });
        const eventIds = linkedEvents.map(event => event._id);

        // 2. Smažeme přihlášky na tyto akce
        await Attendance.deleteMany({ event: { $in: eventIds } });

        // 3. Smažeme akce na tomto místě
        await Event.deleteMany({ location: locationId });

        // 4. Smažeme místo samotné
        await Location.findByIdAndDelete(locationId);

        res.redirect('/locations');
    } catch (error) {
        console.error(error);
        res.status(500).send('Chyba při mazání místa konání.');
    }
};