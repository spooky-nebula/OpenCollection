// General Utility modules
var path = require('path');
// For the webserver
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var nunjucks = require('nunjucks');
// Environment variables for production
var port = process.env.PORT || 3000;
// For user login and presistance
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./database');
// Shop availability
var open = true;
// Variable to store current orders
var orders = [];

passport.use(new Strategy(
  function(username, password, cb) {
    db.database.findByUsername(username, function(err, user) {
      if (err) {
        // console.log("Failed to login");
        return cb(err);
      }
      if (!user) {
        // console.log("Failed to find user");
        return cb(null, false, {
          message: "Username was found"
        });
      }
      if (user.password != password) {
        // console.log("Failed to match password");
        return cb(null, false, {
          message: "Password is incorrect"
        });
      }
      // console.log("Successful Login");
      return cb(null, user);
    });
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.database.findById(id, function(err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});
// Set nunjucks as the render engine
nunjucks.configure('views', {
  autoescape: true,
  express: app
});
app.set('view engine', 'html');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
// app.use(require('morgan')('tiny'));
app.use(require('body-parser').urlencoded({
  extended: true
}));
app.use(require('express-session')({
  secret: 'keyboard bird',
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Serve the asset files and css
app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('index.html', {
    user: req.user
  });
});

app.get('/order', require('connect-ensure-login').ensureLoggedIn(), function(req, res) {
  // db.database.getProducts(function(data) {
  res.render('order.html', {
    user: req.user
    // products: data
  });
  // });
});

app.post('/order', function(req, res) {
  // attach POST to order schema
  var order = {
    user: req.user,
    order: req.order
  };
  res.redirect('/order');
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    res.redirect('/order');
  });

app.get('/register', function(req, res) {
  res.render('register');
});

app.post('/register', function(req, res) {
  // attach POST to user schema
  var user = {
    username: req.body.username,
    name: req.body.name,
    password: req.body.password,
    phone: req.body.phone,
    email: req.body.email,
  };
  // save in database
  db.database.save(user, function(err) {
    if (err) {
      console.log(err);
    }
  });
  res.redirect('/login');
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/line', require('connect-ensure-login').ensureLoggedIn(), function(req, res) {
  if (req.user.username != "admin") {
    res.redirect('/');
  } else {
    res.render('line.html');
  }
});

io.on('connection', function(socket) {
  console.info('poo user connected');

  socket.on('get products', function() {
    db.database.getProducts(function(products) {
      console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
      socket.emit("gotten products", {
        products: products
      });
    });
  });

  socket.on('order', function(data) {
    let cart = data.cart;
    console.log("BBBBBBBBBBBBBB");
  });

  socket.on('open up shop', function() {
    open = true;
  });

  socket.on('close down shop', function() {
    open = false;
  });

  socket.on('disconnect', function() {
    console.log('poo user disconnected');
  });
});

app.listen(port, function() {
  console.info('listening on *:' + port);
});