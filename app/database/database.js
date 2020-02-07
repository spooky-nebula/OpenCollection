const fs = require('fs');
// Load the databases
var products = require('./products.json');
var userbase = require('./userbase.json');

exports.findById = function(id, cb) {
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