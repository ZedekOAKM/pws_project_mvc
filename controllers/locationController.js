const Location = require('../models/Location');


exports.getAddLocation = (req, res) => {
    res.render('add-location'); 
};

exports.postAddLocation = async (req, res) => {
    try {
        const { name, address, city, capacity } = req.body;

        const newLocation = new Location({
            name,
            address,
            city,
            capacity: Number(capacity)
        });

        await newLocation.save();
        res.redirect('/locations'); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Nastala chyba při ukládání místa.');
    }
};


exports.getLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.render('locations', { locations });
    } catch (error) {
        console.error(error);
        res.status(500).send('Chyba při načítání míst.');
    }
};