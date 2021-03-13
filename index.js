const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const loginRouter = require('./routes/login');
const usersRouter = require('./routes/users');
const colorSchemeRouter = require('./routes/color_scheme');
const dataRouter = require('./routes/data');
const settingsRouter = require('./routes/settings');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const passport = require('passport');
const userSchema = require('./models/user.model');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Set up the session to store logged in users
const session = expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: "strict"
    }
});

app.use(cors({ 
    credentials: true,
    origin: function(origin, callback) {
        callback(null, true);
    }
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

// Set up the authentication system
passport.use('local', userSchema.createStrategy());

userSchema.serializeUser = function() {
    return function(user, cb) {
        cb(null, user.id);
    }
};

userSchema.deserializeUser = function() {
    var self = this;

    return function(id, cb) {
        self.findById(id, cb);
    }
};

passport.serializeUser(userSchema.serializeUser());
passport.deserializeUser(userSchema.deserializeUser());

// Connect to the MongoDB Database
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Connected to MongoDB database!");
});

// Define all of the routes
app.use('/', loginRouter);
app.use('/users', usersRouter);
app.use('/color-schemes', colorSchemeRouter);
app.use('/data', dataRouter);
app.use('/settings', settingsRouter);

// Serve frontend
app.use(express.static('app/build'));

app.listen(port, () => {
    console.log("Server is listening on port: " + port);
});
