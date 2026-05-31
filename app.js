require('dotenv').config(); 
const express = require('express');
const session = require('express-session');
const path = require('path'); 
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes'); 
const locationRoutes = require('./routes/locationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, 
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));


app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next(); 
});


app.use('/', authRoutes);
app.use('/', locationRoutes);


app.get('/', (req, res) => {
    res.render('index'); 
});

// // DOČASNÁ ROUTA: Spustí se, když v prohlížeči zadáš http://localhost:3000/make-me-admin
// app.get('/make-me-admin', async (req, res) => {
//     try {
//         const User = require('./models/User'); // Načteme model uživatele

    
//         const updatedUser = await User.findOneAndUpdate(
//             { email: 'i23zededa@oakm.cz' }, 
//             { role: 'admin' },
//             { new: true }
//         );

//         if (!updatedUser) {
//             return res.send('Uživatel s tímto emailem nebyl v databázi nalezen. Zkontroluj, zda jsi email napsal správně.');
//         }

//         res.send(`Úspěch! Uživatel ${updatedUser.username} má nyní v databázi roli: ${updatedUser.role} 👑`);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Chyba při povýšení na admina: ' + error.message);
//     }
// });


app.listen(PORT, () => {
    console.log(`Server běží na http://localhost:${PORT}`);
});