const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const _ = require('lodash');

const Models = require('./src/schema/models');
const models = Models(process.env.MONGO_DB_URL || 'mongodb://localhost/greetings');

const Create = require('./src/handler/create');
const Details = require('./src/handler/details');
const Read = require('./src/handler/read');
// const Update = require('./src/handler/update');
// const Delete = require('./src/handler/delete');

const createRoute = Create(models);
const detailsRoutes = Details(models);
const readRoute = Read(models);
// const updateRoute = Update(models);
// const deleteRoute = Delete(models);
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
app.get('/details/:id', readRoute.getUser);
// app.get('/greeted', nameRoutes.greeted);
// app.get('/clear', nameRoutes.clearHistory);

app.post('/', createRoute.greetSomeone);
// app.post('/clear', nameRoutes.clearHistory);


var port = app.get("port");

app.listen(port, function() {
    console.log('App started on port: ' + port);
});
