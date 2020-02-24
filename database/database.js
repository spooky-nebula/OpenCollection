var fs = require('fs');
var schedule = require('node-schedule');
// Load the databases
var products = require('./products.json');
var userbase = require('./userbase.json');
var orders = require('./orders.json');

var job = schedule.scheduleJob('00 00 00 * *', function() {
  console.log('Reseting availability of all items');
  for (var i = 0, len = products.length; i < len; i++) {
    products[i].available = true;
  }
});

exports.findById = function(id, cb) {
  // console.log("user database access");
  process.nextTick(function() {
    var idx = id - 1;
    if (userbase[idx]) {
      cb(null, userbase[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

exports.findByUsername = function(username, cb) {
  // console.log("user database access");
  process.nextTick(function() {
    for (var i = 0, len = userbase.length; i < len; i++) {
      var user = userbase[i];
      if (user.username === username) {
        return cb(null, user);
      }
    }
    return cb(null, null);
  });
}

exports.findByPhone = function(phone, cb) {
  // console.log("user database access");
  process.nextTick(function() {
    for (var i = 0, len = userbase.length; i < len; i++) {
      var user = userbase[i];
      if (user.phone === phone) {
        return cb(null, user);
      }
    }
    return cb(null, null);
  });
}

exports.save = function(user, cb) {
  // console.log("user database access");
  process.nextTick(function() {
    exports.findByUsername(user.username, function(err, user) {
      if (user) {
        return cb("Could not create new user: Username already exists", null);
      }
    });
    exports.findByUsername(user.phone, function(err, user) {
      if (user) {
        return cb("Could not create new user: User with the same phone number already exists", null);
      }
    });
    user.id = userbase.length + 1;
    userbase.push(user);
    fs.writeFile("./database/userbase.json", JSON.stringify(userbase), (err) => {
      if (err) throw err;
      // console.log("It's saved!");
    });
    return cb(null, null);
  });
}

exports.getProducts = function(cb) {
  // console.log("products database access");
  process.nextTick(function() {
    return cb(products);
  });
}

exports.disableProduct = function(name, cb) {
  process.nextTick(function() {
    for (var i = 0, len = products.length; i < len; i++) {
      var product = products[i];
      if (product.name === name) {
        product.available = false;
        return cb(null, product);
      }
    }
    return cb(null, null);
  });
}

exports.enableProduct = function(name, cb) {
  process.nextTick(function() {
    for (var i = 0, len = products.length; i < len; i++) {
      var product = products[i];
      if (product.name === name) {
        product.available = true;
        return cb(null, product);
      }
    }
    return cb(null, null);
  });
}

exports.findProductByName = function(name, cb) {
  process.nextTick(function() {
    for (var i = 0, len = products.length; i < len; i++) {
      var product = products[i];
      if (product.name === name) {
        return cb(null, product);
      }
    }
    return cb(null, null);
  });
}

exports.saveOldOrder = function(order, cb) {
  // console.log("orders database access");
  process.nextTick(function() {
    orders.push(order);
    fs.writeFile("./database/orders.json", JSON.stringify(orders), (err) => {
      if (err) throw err;
      // console.log("It's saved!");
    });
    return cb(orders);
  });
}

exports.findOldOrdersByUsername = function(username, cb) {
  // console.log("orders database access");
  process.nextTick(function() {
    let o = [];
    for (var i = 0; i < orders.length; i++) {
      if (orders[i].user.username == username) {
        o.push(orders[i]);
      }
    }
    return cb(o);
  });
}