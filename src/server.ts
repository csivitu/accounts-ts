import * as dotenv from 'dotenv';
import express from 'express';
import bodyparser from 'body-parser';
import session from 'express-session';
import hbs from 'express-handlebars';

import { connectMongo } from './models/connect';
import { router as registerRouter } from './routes/register';
import { router as authRouter } from './routes/login';
import { router as forgotPasswordRouter } from './routes/forgotPassword';

dotenv.config();

connectMongo();

const app = express();
const port = process.env.PORT || 3000;

// view engine setup
app.set("views", __dirname + "/templates");

app.engine('html', hbs( {
    extname: '.html',
    defaultLayout: __dirname + '/templates/main',
    layoutsDir: __dirname + '/templates',
    partialsDir: __dirname + '/templates/partials'
  }));

app.set('view engine', 'html');

app.use(bodyparser.urlencoded({
    extended: true,
}));

app.use(bodyparser.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 12 * 60 * 60 * 100,
    },
}));

app.listen(port, () => {
    console.log(`Express server started at port: ${port}`);
});

app.use(express.static('static'));
app.use('/register', registerRouter);
app.use('/login', authRouter);
app.use('/forgotPassword', forgotPasswordRouter);
