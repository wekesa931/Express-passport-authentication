const express = require('express')
const app = express()
const mongoose = require('mongoose')
const expresslayouts = require('express-ejs-layouts')
const PORT = process.env.PORT || 5000
const passport = require('passport')

// Passport config
require('./config/passport')(passport)


// To handle redirect
// Stores message in session and disply upo redirect
const flash = require('connect-flash')
const session = require('express-session')

// DB Config
const db = require('./config/keys').MongoURI

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log())

// Bodyparser
app.use(express.urlencoded({ extended: false }))

// Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash())

// global vars
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})
// EJS
app.use(expresslayouts)
app.set('view engine', 'ejs')
//Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

app.listen(PORT, console.log(`Server started at ${PORT}`));