var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars')
    .create({
        defaultLayout:'main',
        helpers: {
            in: function (elem, list, options) {
                console.log(' in');
                console.log(elem);
                console.log(list);
                if (list.indexOf(elem) > -1) {
                    return true;
                }
                return false;
            },
        }
    });

var beersRouter = require('./routes/beers');
var indexRouter = require('./routes/index');
var breweryRouter = require('./routes/brewery');
var styleRouter = require('./routes/style');
var flavorRouter = require('./routes/flavor');


app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.set('mysql', mysql);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/beers', beersRouter);
app.use('/brewery', breweryRouter);
app.use('/style', styleRouter);
app.use('/flavor', flavorRouter);

app.use(function(req,res){
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});


module.exports = app;