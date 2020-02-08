var fs = require('fs');
var CronJob = require('cron').CronJob;
// Load the databases
var products = require('./products.json');
var userbase = require('./userbase.json');
var orders = require('./orders.json');

var job = new CronJob('00 00 12 * * 0-6', function() {
  console.log('Reseting availability of all items');
  for (var i = 0, len = products.length; i < len; i++) {
    products[i].available = true;
  }
}, null, true, 'Europe/London');

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

exports.save = function(user, cb) {
  // console.log("user database access");
  process.nextTick(function() {
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

exports.disableProduct = function(id, cb) {
  // console.log("products database access");
  process.nextTick(function() {
    products[id].available = false;
    return cb(products);
  });
}

exports.enableProduct = function(id, cb) {
  // console.log("products database access");
  process.nextTick(function() {
    products[id].available = true;
    return cb(products);
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