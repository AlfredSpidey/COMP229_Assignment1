// Created: Alfredo Vieira Neto
// Student Number: 301106786
// Subject: COMP229 - Web Application Development
// Date: 10/01/2020
// Institution: Centennial College
// Component: Server 

// load the things we need
var express = require('express');
var app = express();
var ObjectID = require('mongodb').ObjectID;


var hash = require('pbkdf2-password')()
var path = require('path');
var session = require('express-session');

// config
var logged = false;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Loads the Database functions
var db = require('./db');

db.FindinCol1().then(function(items) {
  var customers = items;
  var users = [{username: 'user', pass: 'user', name: 'User'}];

  app.use(express.urlencoded({ extended: false }))
  app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'shhhh, very secret'
  }));

  // Session-persisted message middleware

  app.use(function(req, res, next){
    var err = req.session.error;
    var msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
  });

  // when you create a user, generate a salt
  // and hash the password ('foobar' is the pass here)

  function hashUsers(){
    users.forEach(user => {
      hash({ password: user.pass }, function (err, pass, salt, hash) {
        if (err) throw err;
        // store the salt & hash in the "db"
        user.salt = salt;
        user.hash = hash;
      });
      
    });
  }
  hashUsers();
  // Authenticate using our plain-object database of doom!

  function authenticate(name, pass, fn) {
    if (!module.parent) console.log('authenticating %s:%s', name, pass);
    var curr_user = {};
    users.forEach(user => {
    if(user.username === name){
      curr_user = user;
    }
    });
    // query the db for the given username
    if (!curr_user) return fn(new Error('cannot find user'));
    // apply the same algorithm to the POSTed password, applying
    // the hash against the pass / salt, if there is a match we
    // found the user
    hash({ password: pass, salt: curr_user.salt }, function (err, pass, salt, hash) {
      if (err) return fn(err);
      if (hash === curr_user.hash) return fn(null, curr_user)
      fn(new Error('invalid password'));
    });
  }

  function restrict(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      req.session.error = 'Access denied!';
      res.redirect('/login');
    }
  }

  app.get('/bussiness_contacts', restrict, function(req, res){
    res.render('pages/bussiness_contacts', {users : customers, logged: logged});
  });

  app.get('/bussiness_contacts/detele/:id', function(req, res){
    let id = new ObjectID(req.params.id);
    db.deleteById(id).then(function(err) {
      console.log(err);
      db.FindinCol1().then(function(items) {
        customers = items;
        res.redirect('/bussiness_contacts');
      });
    });
  });

  app.post('/bussiness_contacts/edit/:id', function(req, res){
    let data = req.body;
    let id = new ObjectID(req.params.id);
    data._id = id;
    db.updateById(id, data).then(function(err) {
      console.log(err);
      db.FindinCol1().then(function(items) {
        customers = items;
        res.redirect('/bussiness_contacts');
      });
    });
  });

  app.post('/bussiness_contacts/add', function(req, res){
    let data = req.body;
    db.addCustomer(data).then(function(err) {
      console.log(err);
      db.FindinCol1().then(function(items) {
        customers = items;
        res.redirect('/bussiness_contacts');
      });
    });
  });

  app.get('/logout', function(req, res){
    logged = false;
    // destroy the user's session to log them out
    // will be re-created next request
    req.session.destroy(function(){
      res.redirect('/');
    });
  });
 
  app.get('/login', function(req, res){
    res.render('pages/login', {logged: logged});
  });

  app.post('/login', function(req, res){
    authenticate(req.body.username, req.body.password, function(err, user){
      if (user) {
        // Regenerate session when signing in
        // to prevent fixation
        req.session.regenerate(function(){
          // Store the user's primary key
          // in the session store to be retrieved,
          // or in this case the entire user object
          req.session.user = user;
          req.session.success = 'Authenticated as ' + user.name
            + ' click to <a href="/logout">logout</a>. '
        + ' You may now access <a href="/bussiness_contacts">Bussiness Contacts List</a>.';
        logged = true;
          res.redirect('back');
        });
      } else {
      logged = false;
        req.session.error = 'Authentication failed, please check your username and password.';
        res.redirect('/login');
      }
    });
  });


  // index page 
  app.get('/', function(req, res) {
    res.render('pages/index', {logged: logged});
  });

  // about page 
  app.get('/about', function(req, res) {
    res.render('pages/about', {logged: logged});
  });

  // projects page 
  app.get('/projects', function(req, res) {
    res.render('pages/projects', {logged: logged});
  });

  // services page 
  app.get('/services', function(req, res) {
    res.render('pages/services', {logged: logged});
  });

  // contact page 
  app.get('/contact', function(req, res) {
    res.render('pages/contact', {logged: logged});
  });

  // Load Public folder
  app.use( express.static( "public" ) );

  // Start Server
  app.listen(process.env.PORT || 3000, 
    () => console.log("Server is running..."));


}, function(err) {
  console.error('The promise was rejected', err, err.stack);
});
