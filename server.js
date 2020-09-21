// load the things we need
var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
	res.render('pages/index');
});

// about page 
app.get('/about', function(req, res) {
	res.render('pages/about');
});

// projects page 
app.get('/projects', function(req, res) {
	res.render('pages/projects');
});

// services page 
app.get('/services', function(req, res) {
	res.render('pages/services');
});

// contact page 
app.get('/contact', function(req, res) {
	res.render('pages/contact');
});

app.listen(3000);
console.log('3000 is the magic port');