require('dotenv').config(); 
const express = require('express');
const session = require('express-session');
const path = require('path'); 
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes'); 

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


app.get('/', (req, res) => {
    res.render('index'); 
});


app.listen(PORT, () => {
    console.log(`Server běží na http://localhost:${PORT}`);
});