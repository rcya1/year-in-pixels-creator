const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const loginRouter = require('./routes/login');
const usersRouter = require('./routes/users');
const colorSchemeRouter = require('./routes/color_scheme');
const dataRouter = require('./routes/data');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const passport = require('passport');

const userSchema = require('./models/user.model');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const session = expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

passport.use('local', userSchema.createStrategy());
passport.serializeUser(userSchema.serializeUser());
passport.deserializeUser(userSchema.deserializeUser());

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

app.use('/', loginRouter);
app.use('/users', usersRouter);
app.use('/color-schemes', colorSchemeRouter);
app.use('/data', dataRouter);

app.listen(port, () => {
    console.log("Server is listening on port: " + port);
});
