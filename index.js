const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const _ = require('lodash');
 
const Models = require('./src/schema/models');
const models = Models(process.env.MONGO_DB_URL || 'mongodb://localhost/greetings');

const languages = require('./src/lib/translation');
const Erase = require('./src/handler/delete');
const Create = require('./src/handler/create');
const Read = require('./src/handler/read');
const XBorder = require('./src/handler/xborder');
// const Details = require('./src/handler/details');
// const Update = require('./src/handler/update');

const deleteRoute = Erase(models);
const createRoute = Create(models);
const readRoute = Read(models);
const crossBorder = XBorder(models);
// const detailsRoutes = Details(models);
// const updateRoute = Update(models);

const app = express();

app.set("port", (process.env.PORT || 3002));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true, cookie: { maxAge: 60000 * 30}}));
app.use(flash()); // set up http session

app.get('/', readRoute.getHomeScreen);
app.post('/', createRoute.greetSomeone);

app.get('/other', readRoute.getOtherScreen);
app.post('/other', crossBorder.greetSomeone);

app.get('/details/:id', readRoute.getUser);

app.get('/login', (req, res, done) => {
    res.render('login');
});

app.get('/admin', readRoute.getNames);
// app.post('/admin', readRoute.getAdminPage);


app.get('/logout', (req, res, done) => {
    res.redirect('/');
});

app.get('/about', function (req, res) {
    res.render('about');
});

app.get('/languages', (req, res, done) => {
    if (languages) {
        res.render('languages', { languages })
    }
});

app.get('/clear', deleteRoute.clearHistory);
// app.post('/clear', nameRoutes.clearHistory);


var port = app.get("port");

app.listen(port, function() {
    console.log('App started on port: ' + port);
});
