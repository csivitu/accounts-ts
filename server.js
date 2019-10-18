require(`dotenv`).config();
require(`./models/db`);

const express = require(`express`);

const bodyparser = require(`body-parser`);

const session = require(`express-session`);

var app = express();

app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(bodyparser.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 12 * 60 * 60 * 100
    }
}));

var port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Express server started at port: ${port}`);
});
