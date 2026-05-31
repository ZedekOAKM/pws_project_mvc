const User = require('../models/User');

exports.getUsers = async (req, res) => {
    try {
     
        const users = await User.find({ _id: { $ne: req.session.user._id } });
        res.render('admin-users', { users });
    } catch (error) {
        console.error(error);
        res.status(500).send('Chyba při načítání uživatelů.');
    }
};


exports.updateRole = async (req, res) => {
    try {
        const userId = req.params.id;
        const { role } = req.body;

        if (!['user', 'organizator', 'admin'].includes(role)) {
            return res.status(400).send('Neplatná role.');
        }

        await User.findByIdAndUpdate(userId, { role });
        res.redirect('/admin/users');
    } catch (error) {
        console.error(error);
        res.status(500).send('Chyba při změně role.');
    }
};