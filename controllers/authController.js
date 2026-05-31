const User = require('../models/User'); 
const bcrypt = require('bcryptjs'); // knihovna sifrovani hesel


exports.getRegister = (req, res) => {
    res.send('Tady bude registrační formulář (EJS šablona).');
};


exports.postRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).send('Uživatel s tímto jménem nebo emailem již existuje.');
        }

       
        const hashedPassword = await bcrypt.hash(password, 12);


        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: 'user' 
        });

        await newUser.save(); 
        res.send('Registrace proběhla úspěšně! Nyní se můžete přihlásit na /login.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Nastala chyba při registraci.');
    }
};


exports.getLogin = (req, res) => {
    res.send('Tady bude přihlašovací formulář (EJS šablona).');
};


exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

       
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Nesprávný email nebo heslo.');
        }

        // Porovnáme heslo z formuláře s tím zašifrovaným hashem v databázi 
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Nesprávný email nebo heslo.');
        }

        
        req.session.user = {
            id: user._id,
            username: user.username,
            role: user.role
        };

        res.send(`Vítejte zpět, ${user.username}! Jste úspěšně přihlášen/a.`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Nastala chyba při přihlašování.');
    }
};


exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Chyba při odhlašování.');
        }
        res.send('Byl jste úspěšně odhlášen.');
    });
};