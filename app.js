require('dotenv').config(); 
const express = require('express');
const session = require('express-session');
const path = require('path'); 
const connectDB = require('./config/db');
const multer = require('multer');

const authRoutes = require('./routes/authRoutes'); 
const locationRoutes = require('./routes/locationRoutes');
const eventRoutes = require('./routes/eventRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statické soubory (CSS, JS z veřejné složky)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, 
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 den
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.notification = req.session.notification || null;
    delete req.session.notification;
    next();
});


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });


app.use('/', authRoutes);
app.use('/locations', locationRoutes);
app.use('/events', eventRoutes);       
app.use('/', attendanceRoutes);
app.use('/admin', adminRoutes);    


app.get('/', (req, res) => {
    res.render('index'); 
});


app.listen(PORT, () => {
    console.log(`Server běží na http://localhost:${PORT}`);
});