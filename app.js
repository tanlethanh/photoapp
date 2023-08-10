const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const handlebars = require('express-handlebars');
const sessions = require('express-session');
const mysqlSession = require('express-mysql-session')(sessions);
const flash = require('express-flash');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const commentRouter = require('./routes/comments');
const errorPrint = require('./helpers/debug/debugprinters').errorPrint;
const requestPrint = require('./helpers/debug/debugprinters').requestPrint;

const app = express();

app.engine(
    'hbs',
    handlebars({
        layoutsDir: path.join(__dirname, 'views/layouts'),
        partialsDir: path.join(__dirname, 'views/partials'),
        extname: '.hbs',
        defaultLayout: 'home',
        helpers: {
            emptyObject: (obj, options) => {
                return !(obj.constructor === Object && Object.keys(obj).length == 0);
            }

        }
    })
);

const mysqlSessionStore = new mysqlSession(
    {
        /* using default options */
    },
    require('./conf/database')
);

app.use(sessions({
    key: 'csid',
    secret: 'this is a secret from csc317',
    store: mysqlSessionStore,
    resave: false,
    saveUninitialized: true
}));

app.use(flash());
// set the engine
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    requestPrint(req.url);
    next();
});

app.use((req, res, next) => {
    console.log(req.session);
    if (req.session.username) {
        res.locals.logged = true;
    }
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentRouter);

app.use((err, req, res, next) => {
    console.log(err);
    res.render('error', { err_message: err });
});

module.exports = app;
