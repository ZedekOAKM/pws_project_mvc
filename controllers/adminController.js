const User = require('../models/User');

// ====== R = READ (Zobrazení seznamu všech uživatelů pro Admina) ======
exports.getUsers = async (req, res) => {
    try {
      
        const users = await User.find({ _id: { $ne: req.session.user.id } });
        res.render('admin-users', { users });
    } catch (error) {
        console.error(error);
        req.session.notification = { type: 'error', text: 'Chyba při načítání seznamu uživatelů.' };
        res.redirect('/');
    }
};

// ====== U = UPDATE (Změna uživatelské role) ======
exports.updateRole = async (req, res) => {
    try {
        const userId = req.params.id;
        const { role } = req.body;

      
        if (!['user', 'organizator', 'admin'].includes(role)) {
            req.session.notification = { type: 'error', text: 'Pokus o nastavení neplatné role! 🛑' };
            return res.redirect('/admin/users');
        }

        await User.findByIdAndUpdate(userId, { role });
        
      
        req.session.notification = { type: 'success', text: 'Uživatelská role byla úspěšně aktualizována. ⚙️' };
        res.redirect('/admin/users');
    } catch (error) {
        console.error(error);
        req.session.notification = { type: 'error', text: 'Chyba při změně uživatelské role.' };
        res.redirect('/admin/users');
    }
};