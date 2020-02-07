// General Utility modules
var path = require('path');
// For the webserver
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const nunjucks = require('nunjucks');
// For user login and presistance
var session = require('express-session')
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./database');

passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) {
        return cb(err);
      }
      if (!user) {
        return cb(null, false, {
          message: "Username was found"
        });
      }
      if (user.password != password) {
        return cb(null, false, {
          message: "Password is incorrect"
        });
      }
      return cb(null, user);
    });
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function(err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('index.html');
});

app.get('/order', require('connect-ensure-login').ensureLoggedIn(), function(req, res) {
  res.render('order.html');
});

app.get('/login', passport.authenticate('local', {
  successRedirect: '/order',
  faliureRedirect: '/login',
  failureFlash: true
}), function(req, res) {
  res.render('login.html');
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/line', require('connect-ensure-login').ensureLoggedIn(), function(req, res) {
  res.render('line.html');
});

io.on('connection', function(socket) {
  console.log('poo user connected');
  socket.on('disconnect', function() {
    console.log('poo user disconnected');
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});