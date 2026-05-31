const User = require('../models/User'); 
const bcrypt = require('bcryptjs'); // knihovna sifrovani hesel

exports.getRegister = (req, res) => {
    res.render('register'); 
};

exports.postRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            req.session.notification = { type: 'error', text: 'Uživatel s tímto jménem nebo e-mailem již existuje. 👤' };
            return res.redirect('/register');
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: 'user' 
        });

        await newUser.save(); 
        
        // Úspěšná registrace
        req.session.notification = { type: 'success', text: 'Účet úspěšně vytvořen! Můžeš se přihlásit. 🎉' };
        res.redirect('/login');

    } catch (error) {
        console.error(error);
        req.session.notification = { type: 'error', text: 'Nastala chyba při registraci.' };
        res.redirect('/register');
    }
};

exports.getLogin = (req, res) => {
    res.render('login'); 
};

exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            req.session.notification = { type: 'error', text: 'Nesprávný e-mail nebo heslo. 🔑' };
            return res.redirect('/login');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.session.notification = { type: 'error', text: 'Nesprávný e-mail nebo heslo. 🔑' };
            return res.redirect('/login');
        }

        req.session.user = {
            id: user._id,
            username: user.username,
            role: user.role
        };

        // Úspěšné přihlášení
        req.session.notification = { type: 'success', text: `Vítej zpět, ${user.username}! 👋` };
        res.redirect('/');

    } catch (error) {
        console.error(error);
        req.session.notification = { type: 'error', text: 'Nastala chyba při přihlašování.' };
        res.redirect('/login');
    }
};

exports.logout = (req, res) => {
    
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.redirect('/');
        }
        res.redirect('/');
    });
};